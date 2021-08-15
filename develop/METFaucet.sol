pragma solidity >= 0.4.19;

// openzeppelinのトークンsolidityファイルを読み込む
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

/**
 * ERC20トークンMET用コントラクト
 */ 
contract METFaucet {
    
    // トークン型の変数
    StandardToken public METoken;
    // トークン所有者のアドレス
    address public METOwner;

    /**
     * コンストラクター
     */
    constructor (address _METoken, address _METOwner) public {
        // 提供されたアドレスをMETokenとして初期化する。
        METoken = StandardToken(_METoken);
        METOwner = _METOwner;
    }

    /**
     * 引き出し関数
     * withdrawamount 引き出し額
     */
    function withdraw(uint withdraw_amount) public {
        // 引き出し金額を10METに制限する。
        require (withdraw_amount <= 1000);
        // METokenのtransferFrom関数を使う。
        METoken.transferFrom(METOwner, msg.sender, withdraw_amount);
    }

    /**
     * フォールバック関数
     */ 
    fallback() public payable {
        // 拒絶する。
        revert();
    }
}