// 第9章 賞金付きパズル用solidityファイル
// コンパイラーバージョンを指定
pragma solidity >= 0.4.15;

contract SimplePrize {
    // ソルト
    bytes32 public constant salt = bytes32("987463829");
    // 公約
    bytes32 public commitment;

    // コンストラクター (0.4.22以上はコントラクトと同じ名前が使えなくなった！)
    // _commitment：公約
    function SimplePrize (bytes32 _commitment) public payable {
        // 公約を保存する。
        commitment = _commitment;
    }

    // 公約を生成する関数
    // 引数：answer
    // 戻り値：ハッシュ値
    function createCommitment (uint answer) public view returns (bytes32) {
        // ハッシュ値を生成する。
        return keccak256(salt, answer);
    }

    // 答え合わせを実施する関数
    // 引数：回答
    function guess (uint answer) public {
        // 正しい回答から生成されたハッシュ値と比較する。
        require(createCommitment(answer) == commitment);
        // 賞金を送金する。
        msg.sender.transfer(this.balance);
    }

    // 入金用フォールバック関数
    function () public payable {}
}

// 公約-公表パズル用コントラクト
contract CommitmentPuzzle {
    // 回答推測期間
    uint public constant GUESS_DURATION_BLOCKS = 5;
    // 公表期間
    uint public constant REVEAL_DURATION_BLOCKS = 5;
    // コントラクト作成者のアドレス
    address public creator;
    // 回答推測期間期限
    uint public guessDeadline;
    // 公表期間期間
    uint public revealDeadline;
    // 賞金額
    uint public totalPrize;
    // 解答者のアドレスと公約を紐付けるマップ
    mapping(address => bytes32) public commitments;
    // 当選者のアドレス
    address[] public winners;
    // アドレスと賞金の払い出し有無を紐付けるマップ
    mapping(address => bool) public claimed;

    // コンストラクター
    // 引数：公約
    function CommitmentPuzzle (bytes32 _commitment) public payable {
        // コントラクター作成者のアドレスを格納する。
        creator = msg.sender;
        // 公約を格納する。
        commitments[creator] = _commitment;
        // 解答期限と公表期間の設定
        guessDeadline = block.number + GUESS_DURATION_BLOCKS;
        revealDeadline = guessDeadline + REVEAL_DURATION_BLOCKS;
        // 賞金額を増加させる。
        totalPrize += msg.value;
    }

    // 解答の公約を生成するための関数
    // user：解答者のアドレス
    // answer：解答
    // 戻り値：解答の公約
    function createCommitment (address user, uint answer) public pure returns (bytes32) {
        return keccak256(user, answer);
    } 

    // 解答案を提出するための関数
    function guess (bytes32 _commitment) public {
        // 解答期間内であることとコントラクト作成者以外であることをチェックする。
        require(block.number < guessDeadline);
        require(creator != msg.sender);
        // 解答の公約を保存する。
        commitments[msg.sender] = _commitment;
    }

    // 正解をチェックするための関数
    // answer：解答
    function reveal (uint answer) public {
        // 解答期限が過ぎていることと解答公表期間内であることをチェックする。
        require(block.number > guessDeadline);
        require(block.number < revealDeadline);
        // 解答者が作成した公約とguess関数でプレイヤーが提出した公約が一致していることを確認する。
        require(createCommitment(msg.sender, answer) == commitments[msg.sender]);
        require(createCommitment(creator, answer) == commitments[creator]);
        // 当選済みでないことをチェックする。
        require(!isWinner(msg.sender));
        // 当選者アドレスリストに追加する。
        winners.push(msg.sender);
    }

    // 賞金を払い出すための関数
    function claim () public {
        require(block.number > revealDeadline);
        // 払い出し済みでないことをチェックする。
        require(claimed[msg.sender] == false);
        require(isWinner(msg.sender));
        // 払い出し額の算出
        uint payout = totalPrize / winners.length;
        claimed[msg.sender] = true;
        // 送金する
        msg.sender.transfer(payout);
    }

    // 当選済みかどうかチェックする関数
    // user：チェック対象のアドレス
    function isWinner (address user) public view returns (bool) {
        bool winner = false;
        // チェックする
        for (uint i=0; i < winners.length; i++) {
            if (winners[i] == user) {
                winner = true;
                break;
            }
        }
        return winner;
    }

    // フォールバック関数
    function () public payable {
        totalPrize += msg.value;
    }
}
