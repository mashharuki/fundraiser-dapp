// 第8章 宝くじ用solidityファイル
// コンパイラーバージョンを指定
pragma solidity >=0.4.15;

// 単純な宝くじ用コントラクト
contract SimpleLottery {
    // チケット代
    // 0.01イーサ
    uint public constant TICKET_PRICE = 1e16;
    // チケットリスト
    address[] public tickets;
    // 当選者のアドレス
    address public winner;
    // 宝くじの購入時刻
    uint public ticketingCloses;

    // コンストラクター
    // duration (購入期間)
    constructor (uint duration) public {
        ticketingCloses = block.timestamp + duration;
    }

    // チケット購入関数
    function buy () public payable {
        require(msg.value == TICKET_PRICE);
        // 購入期間であることを確認する。
        require(block.timestamp < ticketingCloses);
        // チケットリストにアドレスを追加する。
        tickets.push(msg.sender);
    }

    // チケット当選者処理
    function drawWinner () public {
        // チケットの当選待ち時間を5分にセットする。
        require(block.timestamp > ticketingCloses + 5 minutes);
        require(winner == address(0));
        // 乱数生成
        bytes32 rand = keccak256(block.blockhash(block.number - 1));
        // 当選者を選別する。
        winner = tickets[uint(rand) % tickets.length];
    }

    // 引き出し関数
    function withdraw () public {
        require(msg.sender == winner);
        // 当選者にコントラクト残高を全て送信する。
        msg.sender.transfer(this.balance);
    }

    // フォールバック関数
    fallback() payable public {
        buy();
    }
}

// 複数回宝くじ用コントラクト
contract RecurringLottery {
    // ラウンド用構造体宣言
    struct Round {
        uint endBlock;
        uint drawBlock;
        Entry[] entries;
        // 宝くじの総数
        uint totalQuantity;
        // 当選者のアドレス
        address winner;
    }
    // エントリー用構造体宣言
    struct Entry {
        // 購入者のアドレス
        address buyer;
        // 宝くじの総数
        uint quantity;
    }
    // チケット料金
    uint public constant TICKET_PRICE = 1e15;
    // ラウンドの情報を格納したマップ変数
    mapping(uint => Round) public rounds;
    // ラウンド数
    uint public round;
    // 購入期間
    uint public duration;
    // コントラクの残高用の内部台帳
    mapping(address => uint) public balances;

    // コンストラクター(デプロイしたときに1度だけ実行される。)
    // duraionは、ブロック数。1日 = 5500ブロック
    constructor (uint _duration) public {
        duration = _duration;
        round = 1;
        rounds[round].endBlock = block.number + duration;
        rounds[round].drawBlock = block.number + duration + 5;
    }

    // 宝くじ購入関数
    function buy () payable public {
        // 購入額がチケット代の倍数であることを確認する。
        require(msg.value % TICKET_PRICE == 0);
        // 現在のラウンドが終了したかどうかを確認する。
        if (block.number > rounds[round].endBlock) {
            round += 1;
            rounds[round].endBlock = block.number + duration;
            rounds[round].drawBlock = block.number + duration + 5;
        }
        // 宝くじ購入総数を更新する。
        uint quantity = msg.value / TICKET_PRICE;
        // アドレスと購入枚数をエントリー情報にセットする。
        Entry memory entry = Entry(msg.sender, quantity);
        // エントリー情報をラウンド構造に追加する。
        rounds[round].entries.push(entry);
        // 宝くじ総数を更新する。
        rounds[round].totalQuantity += quantity;
    }

    // 宝くじ抽選ロジック
    // 引数：抽選対象ラウンド数
    function drawWinner (uint roundNumber) public {
        Round storage drawing = rounds[roundNumber];
        require(drawing.winner == address(0));
        require(block.number > drawing.drawBlock);
        require(drawing.entries.length > 0);
        // 当選者を抽選する。
        bytes32 rand = keccak256(block.blockhash(drawing.drawBlock));
        uint counter = uint(rand) % drawing.totalQuantity;
        // アカウント毎に宝くじに当選しているかチェックする。
        for (uint i = 0;i < drawing.entries[i].quantity; i++) {
            // 宝くじの総数を獲得する。
            uint quantity = drawing.entries[i].quantity;
            // 当選しているか否か確認する。
            if (quantity > counter) {
                drawing.winner = drawing.entries[i].buyer;
                break;
            } else {
                counter -= quantity;
            }
        }
        // 賞金の算出する。
        balances[drawing.winner] += TICKET_PRICE * drawing.totalQuantity;
    }

    // 引き出し関数
    function withdraw () public {
        // 残高を設定
        uint amount = balances[msg.sender];
        // 内部残高を0にする。
        balances[msg.sender] = 0;
        // 当選者にコントラクト残高を全て送信する。
        msg.sender.transfer(amount);
    }

    // ラウンド情報を削除する。
    function deleteRound (uint _round) public {
        require(block.number > rounds[_round].drawBlock + 100);
        require(rounds[_round].winner != address(0));
        // ラウンド情報を削除する。
        delete rounds[_round];
    }

    // フォールバック関数
    fallback() payable public {
        buy();
    }
}

// RNG宝くじ用コントラクト
// RNG(Random Number Generator) 乱数要素
contract RNGLottery {
    // チケット料金
    uint public constant TICKET_PRICE = 1e16;
    // チケットリスト
    address[] public tickets;
    // 当選者のアドレス
    address public winner;
    // シード
    bytes32 public seed;
    // 提出する公約用マップ変数
    mapping (address => bytes32) public commitments;
    // チケット購入期限
    uint public ticketDeadline;
    uint public revealDeadline;
    uint public drawBlock;

    // コンストラクター
    // duration：宝くじ配布期間
    // revealDuration：公表期間
    constructor (uint duration, uint revealDuration) public {
        ticketDeadline = block.number + duration;
        revealDeadline = ticketDeadline + revealDuration;
        drawBlock = revealDeadline + 5;
    }
 
    // 公約を作成する関数
    function createCommitment (address user, uint N) public pure returns (bytes32 commitment){
        return keccak256(user, N);
    }

    // 購入関数
    function buy (bytes32 commitment) payable public {
        require(msg.value == TICKET_PRICE);
        require(block.number <= ticketDeadline);
        // 公約する。
        commitments[msg.sender] = commitment;
    } 

    // 公表するためのロジック
    // N：秘密の数(購入者が任意に決める。)
    function reveal (uint N) public {
        require(block.number > ticketDeadline);
        require(block.number <= revealDeadline);
        // ハッシュ値を取得する。
        bytes32 hash = createCommitment(msg.sender, N);
        // 生成された公約と公約段階でのハッシュ値が一致するかチェックする。
        require(hash == commitments[msg.sender]);
        // シードを生成する。
        seed = keccak256(seed, N);
        // チケットリストに購入者のアドレスを追加する。
        tickets.push(msg.sender);
    }

    // チケット当選者処理
    function drawWinner () public {
        // チケットの当選待ち時間を5分にセットする。
        require(block.number > drawBlock);
        require(winner == address(0));
        // 当選者を選抜する。
        uint randIndex = uint(seed) % tickets.length;
        // 当選者のアドレスを格納する。
        winner = tickets[randIndex];
    }

    // 引き出し関数
    function withdraw () public {
        require(msg.sender == winner);
        // 当選者にコントラクト残高を全て送信する。
        msg.sender.transfer(this.balance);
    }
}
