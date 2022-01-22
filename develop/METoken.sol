/**
 * 独自コイン「MET」を発行するためのコントラクト
 */
 
pragma solidity >= 0.4.21;
// openzeppelinのトークンsolidityファイルを読み込む
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

/**
 * METokenコントラクト
 * ERC020のStandardTokenを継承する。
 */
contract METoken is StandardToken {
    // トークン名
    string public constant name = 'Mastering Ethereum Token';
    // シンボル名
    string public constant symbol = 'MET';
    // 2
    uint8 public constant decimals = 2;
    // 初期供給量
    uint constant _initial_supply = 2100000000;
    
    /**
     * コンストラクター
     */
    constructor () public {
        // 初期供給量
        totalSupply_ = _initial_supply;
        // 残高を設定
        balances[msg.sender] = _initial_supply;
        // イベントの呼び出し
        emit Transfer(address(0), msg.sender, _initial_supply);
    }
}

