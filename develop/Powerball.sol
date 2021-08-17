// パワーボール用コントラクト
// コンパイラーバージョンの指定
pragma solidity >= 0.4.15;

contract Powerball {
    // ラウンドを表す構造体
    struct Round {
        // 購入締め切り時刻
        uint endTime;
        // 未来のブロック情報
        uint drawBlock;
        // 当選番号
        uint[6] winningNumbers;
        // 当選番号の配列
        mapping(address => uint[6][]) tickets;
    }
    // チケットの代金 (0.002イーサに指定されている。)
    uint public constant TICKET_PRICE = 2e15;
    // 標準番号として選べる最大値
    uint public constant MAX_NUMBER = 69;
    // パワーボール番号の最大値
    uint public constant MAX_POWERBALL_NUMBER = 26;
    // ラウンドの長さ
    uint public constant ROUND_LENGTH = 3 days;

    // ラウンド数を格納する変数
    uint public round;
    // ラウンド数の情報を格納するマップ変数
    mapping(uint => Round) public rounds;

    // コンストラクター
    constructor () public {
        round = 1;
        rounds[round].endTime = block.timestamp + ROUND_LENGTH;
    }

    // 宝くじ購入関数
    function buy (uint[6][] numbers) payable public {
        require(numbers.length * TICKET_PRICE == msg.value);
        // 各宝くじ券のパワーボール以外の番号が一意であることを確認
        for (uint k=0; k < numbers.length; k++) {
            for (uint i=0; i < 4; i++) {
                for (uint j=i+1; j < 5; j++) {
                    require(numbers[k][i] != numbers[k][j]);
                }
            }
        }
        // 選ばれた番号が受容可能な範囲内にあることを確認
        for (i=0; i < numbers.length; i++) {
            for (j=0; j < 6; j++) 
                require(numbers[i][j] > 0);
            for (j=0; j < 5; j++) 
                require(numbers[i][j] <= MAX_NUMBER);
            require(numbers[i][5] <= MAX_POWERBALL_NUMBER);
            
        }
        // ラウンド終了をチェックする。
        if (block.timestamp > rounds[round].endTime) {
            // 乱数生成のための未来のブロックを更新する。
            rounds[round].drawBlock = block.number + 5;
            // ラウンド数を追加する。
            round += 1;
            // 購入締め切り時刻を更新しました。
            rounds[round].endTime = block.timestamp + ROUND_LENGTH;
        }

        // 当選番号を追加する。
        for (i=0; i < numbers.length; i++)
            rounds[round].tickets[msg.sender].push(numbers[i]); 
    }

    // 当選番号を選出するための関数
    function drawNumbers (uint _round) public {
        // 乱数生成用の未来のブロック
        uint drawBlock = rounds[_round].drawBlock;
        // 購入締め切り期間を超えていることを確認する。
        require(block.timestamp > rounds[_round].endTime);
        // drawBlockを超えていることをチェックする。
        require(block.number >= drawBlock);
        // 当選番号が未設定であることをチェックする。
        require(rounds[_round].winningNumbers[0] == 0);

        uint i = 0;
        uint seed = 0;

        while (i < 5) {
            // 乱数生成
            bytes32 rand = keccak256(block.blockhash(drawBlock),seed);
            // 剰余演算により乱数の範囲を限定する。
            uint numberDraw = uint(rand) % MAX_NUMBER + 1;
            // パワーボール以外の番号は一意でなければならない。
            bool duplicate = false;
            for (uint j = 0; j < i; j++) {
                if (numberDraw == rounds[_round].winningNumbers[j]) {
                    duplicate = true;
                    seed++;
                    break;
                }
            }
            if (duplicate)
                continue;

            // 当選番号の一つとして保存する。
            rounds[_round].winningNumbers[i] = numberDraw;
            i++;
            seed++;
        }
        // 乱数生成
        rand = keccak256(block.blockhash(drawBlock), seed);
        // 乱数から番号を生成する。
        uint powerballDraw = uint(rand) % MAX_POWERBALL_NUMBER + 1;
        // 当選番号の一つとして保存する。
        rounds[_round].winningNumbers[5] = powerballDraw;
    }

    // 賞金を払い出すための関数
    // _round：ラウンド数
    function claim (uint _round) public {
        // 宝くじの券を購入していなければならない
        require(rounds[_round].tickets[msg.sender].length > 0);
        // 当選ずみであることをチェックする。
        require(rounds[_round].winningNumbers[0] != 0);

        uint[6][] storage myNumbers = rounds[_round].tickets[msg.sender];
        uint[6] storage winningNumbers = rounds[_round].winningNumbers;
        // 賞金額
        uint payout = 0;

        for (uint i=0; i < myNumbers.length; i++) {
            // 当選番号と一致した数
            uint numberMatches = 0;
            // 合致しているかチェック
            for (uint j=0; j < 5; j++) {
                for (uint k=0; k < 5; k++) {
                    if (myNumbers[i][j] == winningNumbers[k])
                        numberMatches += 1;
                }
            }
            // 券のパワーボール番号と当選したパワーボール番号を比較する。
            bool powerballMatches = (myNumbers[i][5] == winningNumbers[5]);
            // 当選条件
            if (numberMatches == 5 && powerballMatches) {
                // コントラクトが保有している残高全てが賞金となる。
                payout = this.balance;
                break;
            } else if (numberMatches == 5) {
                payout += 1000 ether;
            } else if (numberMatches == 4 && powerballMatches) {
                payout += 50 ether;
            } else if (numberMatches == 4) {
                // .1イーサ
                payout += 1e17;
            } else if (numberMatches == 3 && powerballMatches) {
                // .1イーサ
                payout += 1e17;
            } else if (numberMatches == 3) {
                // .007イーサ
                payout += 7e15;
            } else if (numberMatches == 2 && powerballMatches) {
                // .007イーサ
                payout += 7e15;
            } else if (powerballMatches) {
                // .004イーサ
                payout += 4e15;
            }
        }
        // 賞金をコントラクト呼び出し元に送金する。
        msg.sender.transfer(payout);
        // 呼び出し元に紐づく宝くじの情報を削除する。
        delete rounds[_round].tickets[msg.sender];
    }

    // パワーボールの券を参照するための関数
    // _round：ラウンド数
    // user：アドレス
    // パワーボールの宝くじ券(戻り値)
    function ticketsFor (uint _round, address user) public view returns (uint[6][] tickets) {
        return rounds[_round].tickets[user];
    }

    // 当選番号を参照する関数
    // _round：ラウンド数
    // winningNumbers：当選番号 (戻り値)
    function winningNumbersFor(uint _round) public view returns (uint[6] winningNumbers) {
        return rounds[_round].winningNumbers;
    }
}