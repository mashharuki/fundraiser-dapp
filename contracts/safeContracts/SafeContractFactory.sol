/**
 * マルチシグウォレット生成コントラクト
 */

pragma solidity >0.4.23;
// 必要なものをインポートする。
import "./GnosisSafe.sol";

/**
 * SafeContractFactoryコントラクト
 */
contract SafeContractFactory {

    // GnosisSafe型の配列
    GnosisSafe[] private _safecontracts;
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
     * GnosisSafeのインスタンス生成関数
     *      address[] calldata _owners,
            uint256 _threshold,
            address to,
            bytes calldata data,
            address fallbackHandler,
            address paymentToken,
            uint256 payment,
            address payable paymentReceiver

     */
    function createSafeContract (string memory walletName_) public returns (GnosisSafe safecontract) {
            // インスタンスを生成
            safecontract = new GnosisSafe (walletName_);
            // setup関数の呼び出し
            // safecontract.setup(_owners, _threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver);
            // イベントの発行
            emit SafeContractCreated(safecontract, walletName_);
    }

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
            coll[i] = _safecontracts[offset + i];
        }

        return coll;    
    }
}
