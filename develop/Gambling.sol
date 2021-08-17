// ギャンブルゲーム系コントラクト用ファイル
// コンパイラーのバージョンを指定
pragma solidity >= 0.4.15;

// サトシダイス用コントラクト
contract SatoshiDice {
    // 賭けの情報を表す構造体 Betを宣言
    struct Bet {
        // ユーザーのアドレス
        address user;
        // 乱数生成用のブロック番号
        uint block;
        // 賭け対象となる上限数
        uint cap;
        // 賭けの量
        uint amount;
    }
    // 手数料の分子
    uint public constant FEE_NUMERATOR = 1;
    // 手数料の分母
    uint public constant FEE_DENOMINATOR = 100;
    uint public constant MAXIMUM_CAP = 100000;
    // 一回でかけられる最大値
    uint public constant MAXIMUM_BET_SIZE = 1e18;
    // コントラクトの作成者
    address public owner;
    // ID割り当て用のカウンター
    uint public counter = 0;
    // 賭けIDと構造体を紐づけるマップ変数
    mapping (uint => Bet) public bets;
    // 各種イベントを設定
    // 賭けの行ったときのイベント
    event BetPlaced(uint id, address user, uint cap, uint amount);
    // 賭けの結果が確定したときのイベント
    event Roll(uint id, uint rolled);

    // コンストラクター
    function SatoshiDice () {
        // コントラクト作成者のアドレスを格納する。
        owner = msg.sender;
    }

    // 賭けを実行するための関数
    // cap：上限数
    function wager (uint cap) public payable {
        // 上限値を超えていないかチェックする。
        require(cap <= MAXIMUM_CAP);
        require(msg.value <= MAXIMUM_BET_SIZE);
        // カウンターを増やす。
        counter++;
        // 賭け情報の構造体に情報を追加する。
        bets[counter] = Bet(msg.sender, block.number + 3, cap, msg.value);
        // イベントを呼び出す。
        BetPlaced(counter, msg.sender, cap, msg.value);
    }

    // サイコロを振る関数
    // id：賭けID
    function roll (uint id) public {
        // 賭け情報を引っ張ってくる
        Bet storage bet = bets[id];
        // 各種条件をチェックする。
        // 賭けた本人であること
        require(msg.sender == bet.user);
        require(block.number >= bet.block);
        require(block.number <= bet.block + 255);
        // 乱数生成
        bytes32 random = keccak256(block.blockhash(bet.block), id);
        // サイコロの結果
        uint rolled = uint(random) % MAXIMUM_CAP;
        // 賭けの勝った場合は、賞金額を算出する。
        if (rolled < bet.cap) {
            uint payout = bet.amount * MAXIMUM_CAP / bet.cap;
            // 手数料を算出する。
            uint fee = payout * FEE_NUMERATOR / FEE_DENOMINATOR;
            // 手数料を引く
            payout -= fee;
            // 賞金を送金する。
            msg.sender.transfer(payout);
        }
        // イベントを呼び出す
        Roll (id, rolled);
        // 賭け情報を削除する。
        delete bets[id];
    }

    // 入金用関数
    function fund () public payable {}

    // コントラクトを自己解体するための関数
    function kill () public {
        require(msg.sender == owner);
        // コントラクトの情報をステートツリーから削除する。(自己解体)
        selfdestruct(owner);
    }
}

// ルーレット用コントラクト
contract CasinoRoulette {
    // 賭けの種類を表す列挙型変数
    enum BetType { Color, Number, Odd}
    // 賭けの情報を表す構造体を定義する。
    struct Bet {
        // ユーザーのアドレス
        address user;
        // 乱数生成用のブロック番号
        uint block;
        // 賭けの種類
        BetType betType;
        // 賭けの量
        uint amount;
        // @prop choice
        // BetType.Color 0=黒,1=赤
        // BetType.Number -1=00, 0-36
        // 洗濯した種類
        int choice;
    }
    // ルーレットのホイールのパケット数
    uint public constant NUM_POCKETS = 38;  
    // RED_NUMBERとBLACK_NUMBERは定数だが、
    // storage配列を代替として使用する。
    uint8[18] public RED_NUMBERS = [2, 4, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    uint8[18] public BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
    uint8[18] public ODD_NUMBERS = [1, 3, 5, 7, 9, 11, 13, 15, 17, 21, 23, 25, 27, 29, 31, 33, 35, 37];
    // ホイール番号と色を対応付けするマップ変数
    mapping (int => int) public COLORS;
    // コントラクト作成者のアドレス
    address public owner;
    // IDを割り当てるためのカウンター
    uint public counter = 0;
    // 賭けIDとかけ情報を紐づけるマップ
    mapping(uint => Bet) public bets;
    // 各種イベントを設定
    // 賭けの行ったときのイベント
    event BetPlaced(address user, uint amount, BetType betType, uint block, int choice);
    // 賭けの結果が確定したときのイベント
    event Spin(uint id, int landed);

    // コンストラクター
    function CasinoRoulette () public {
        owner = msg.sender;
        // 赤の番号は1とする。
        for (uint i=0; i < 18; i++) {
            COLORS[RED_NUMBERS[i]] = 1;
            COLORS[ODD_NUMBERS[i]] = 2;
        }
    }

    // 賭けを実行するための関数(ゲームプレイ関数)
    // BetType：賭けの種類
    // choice：選択した数字
    function wager (BetType betType, int choice) payable public {
        require(msg.value > 0);
        // 賭けの種類が色か番号かでチェックする内容が変わる。
        if (betType == BetType.Color) 
            require(choice == 0 || choice == 1);
        else if (betType == BetType.Odd) 
            require(choice == 0 || choice == 2);
        else
            require(choice >= -1 && choice <= 36);
        // カウンターをインテンド
        counter++;
        // 賭け情報を登録する。
        bets[counter] = Bet(msg.sender, msg.value, betType, block.number + 3, choice);
        // イベントの呼び出し
        BetPlaced(msg.sender, msg.value, betType, block.number + 3, choice);
    }

    // ルーレットを振る関数
    // id：賭けID
    function spin (uint id) public {
        // 賭け情報を引っ張ってくる
        Bet storage bet = bets[id];
        // 各種条件をチェックする。
        // 賭けた本人であること
        require(msg.sender == bet.user);
        require(block.number >= bet.block);
        require(block.number <= bet.block + 255);
        // 乱数生成
        bytes32 random = keccak256(block.blockhash(bet.block), id);
        // ルーレットの結果
        int landed = int(uint(random) % NUM_POCKETS) - 1;
        // 当選しているかどうかチェックする。
        if (bet.betType == BetType.Color) {
            if(landed > 0 && COLORS[landed] == bet.choice)
                // 賞金を送金する
                msg.sender.transfer(bet.amount * 2);
        } else if (bet.betType == BetType.Number) {
            if (landed == bet.choice)
                // 賞金を送金する
                msg.sender.transfer(bet.amount * 35);
        } else if (bet.betType == BetType.Odd) {
            if(landed > 0 && COLORS[landed] == bet.choice)
                // 賞金を送金する
                msg.sender.transfer(bet.amount * 2);
        }
        // イベントを呼び出す
        Spin (id, landed);
        // 賭け情報を削除する。
        delete bets[id];
    }

    // 入金用関数
    function fund () public payable {}

    // コントラクトを自己解体するための関数
    function kill () public {
        require(msg.sender == owner);
        // コントラクトの情報をステートツリーから削除する。(自己解体)
        selfdestruct(owner);
    }    
}