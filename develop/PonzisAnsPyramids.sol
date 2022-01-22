// 第7章 ポンジとピラミッドのsolidityファイル
// ポンジスキームとピラミッドスキームをモデルにしている。
// ポンジスキーム：詐欺の一種
pragma solidity >= 0.4.15;

// ポンジスキーム用コントラクト
contract SimplePonzi {
    // 出資者のアドレス
    address public currentInvestor;
    // 出資額
    uint public currentInvestment = 0;

    // 入金用フォールバック関数
    function () public payable {
        // 新しい出資は現在の出資より10%大きくなければならない
        uint minimumInvestment = currentInvestment * 11/10;
        require(msg.value > minimumInvestment);
        // 新しい出資者を記録する
        address previousInvestor = currentInvestor;
        currentInvestor = msg.sender;
        currentInvestment = msg.value;
        // 前の出資者に支払いを行う。
        previousInvestor.transfer(msg.value);
    }
}

// 現実的なポンジスキーム用コントラクト
contract GradualPonzi {
    // 出資者のアドレスを格納する配列
    address[] public investors;
    // アドレスと残高を格納するマップ変数
    mapping (address => uint) public balances;
    // 最小の出資額
    uint public constant MINUMUM_INVESTMENT = 1e15;

    // コンストラクター
    // デプロイ時に一度だけ実行される。
    function GradualPonzi () public {
        // コントラクトの作成者が最初の出資者として登録される。
        investors.push(msg.sender);
    }

    // フォールバック関数(出資ロジック)
    function () public payable {
        // 最低額の出資金を所持していることをチェックする。
        require(msg.value >= MINUMUM_INVESTMENT);
        // 分配額を算出する。
        uint eachInvestorGets = msg.value / investors.length;
        // 前出資者に分配する。
        for (uint i = 0; i < investors.length; i++) {
            balances[investors[i]] += eachInvestorGets;
        }
        // 最新の出資者が出資者リストに追加される。
        investors.push(msg.sender);
    }

    // 引き出し関数
    function withdraw () public {
        uint payout = balances[msg.sender];
        // 残高を0にする。
        balances[msg.sender] = 0;
        msg.sender.transfer(payout);
    }
}

// 単純なピラミッドスキーム用のコントラクト
contract SimplePyramid {
    // 最小の出資額
    uint public constant MINIMUM_INVESTMENT = 1e15;
    // 出資したアドレス数
    uint public numInvestors = 0;
    // ピラミッドの深さ
    uint public depth = 0;
    // 出資者リストの配列
    address[] public investors;
    // イーサ残高の内部台帳
    mapping (address => uint) public balances;

    // コンストラクター
    function SimplePyramid () public payable {
        // 最低額の出資金を所持していることをチェックする。
        require(msg.value >= MINIMUM_INVESTMENT);
        // 出資者の数
        investors.length = 3;
        // コントラクトの作成者が最初の出資者になる。
        investors[0] = msg.sender;
        // 出資者数を1に設定する。
        numInvestors = 1;
        // 深さを1に設定する。
        depth = 1;
        balances[address(this)] = msg.value;
    }

    // フォールバック関数
    function () payable public {
        // 最低額の出資金を所持していることをチェックする。
        require(msg.value >= MINIMUM_INVESTMENT);
        // コントラクトの内部残高が出資額分追加更新する。
        balances[address(this)] += msg.value;
        // 出資者を追加する。
        numInvestors += 1;
        // 出資者を配列の最後に追加する。
        investors[numInvestors - 1] = msg.sender;

        if (numInvestors == investors.length) {
            // 前の層に支払う
            uint endIndex = numInvestors - 2**depth;
            uint startIndex = endIndex - 2**(depth - 1);

            for (uint i = startIndex; i < endIndex; i++)
                balances[investors[i]] += MINIMUM_INVESTMENT;
            
            // ステート変数を更新
            balances[address(this)] = 0;
            // 深さを更新する。
            depth += 1;
            // 出資者リスト数更新
            investors.length += 2**depth;
        }
    }

    // 引き出し関数
    function withdraw () public {
        // 出資額
        uint payout = balances[msg.sender];
        // 内部残高を0にする。
        balances[msg.sender] = 0;
        // イーサを送金する。
        msg.sender.transfer(payout);
    }
}