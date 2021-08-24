/**
 * マルチシグウォレット生成コントラクト
 */

pragma solidity >0.4.23;
// 必要なものをインポートする。
import "./GnosisSafe.sol";
import "./GnosisSafeL2.sol";

/**
 * SafeContractFactoryコントラクト
 */
contract SafeContractFactory {

    // GnosisSafe型の配列
    GnosisSafe[] private _safecontracts;
    // GnosisSafeL2型の配列
    // GnosisSafeL2[] private _safecontractl2s;
    // 関数から返すことのできる最大値
    uint256 constant maxLimit = 20;

    // インスタンスが生成された時のイベント
    event SafeContractCreated (GnosisSafe indexed gnosisSafe, string name);

    /**
     * GnosisSafeのインスタンス数を取得する関数
     */
    function safeContractsCount () public view returns (uint256) {
        return _safecontracts.length;
    }

    /**
     * GnosisSafeL2のインスタンス数を取得する関数
    
    function safeContractL2sCount () public view returns (uint256) {
        return _safecontractl2s.length;
    }
    */


    /**
     * GnosisSafeのインスタンス生成関数
     */
    function createSafeContract (string memory walletName_) {
        // インスタンスを生成
        GnosisSafe safecontract = new GnosisSafe (walletName_);
        // 配列に格納する。
        _safecontracts.push(safecontract);
        // イベントの発行
        emit SafeContractCreated(safecontract, walletName_);
    }

    /**
     * GnosisSafeL2インスタンス生成関数
     */

    /**
     * GnosisSafeの空のコレクションを返す関数
     */
    function safeContracts (uint256 limit, uint256 offset) public view returns (GnosisSafe[] memory coll) {
        
        require (offset <= safeContractsCount(), "offset out of bounds");
        // 最大値を上回っている場合は、limitを格納する。
        uint256 size = safeContractsCount() - offset;
        size = size < limit ? size : limit;
        // sizeは、maxLimitを超えてはならない。
        size = size < maxLimit ? size : maxLimit;
        coll = new GnosisSafe[](size);

        for (uint256 i = 0; i < size; i++) {
            coll[i] = __safecontracts[offset + i];
        }

        return coll;    
    }

    /**
     * GnosisSafeL2の空のコレクションを返す関数
     
    function safeContractL2s (uint256 limit, uint256 offset) public view returns (GnosisSafeL2[] memory coll) {
        
        require (offset <= safeContractL2sCount(), "offset out of bounds");
        // 最大値を上回っている場合は、limitを格納する。
        uint256 size = safeContractL2sCount() - offset;
        size = size < limit ? size : limit;
        // sizeは、maxLimitを超えてはならない。
        size = size < maxLimit ? size : maxLimit;
        coll = new GnosisSafeL2[](size);

        for (uint256 i = 0; i < size; i++) {
            coll[i] = _safecontractl2s[offset + i];
        }

        return coll;    
    }
    */
}
