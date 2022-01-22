/**
 * マルチシグウォレット生成コントラクト
 */

pragma solidity >0.4.23;
// 読み込む
import "./SimpleMultiSig.sol";

/**
 * MultiSigFactoryコントラクト
 */
contract MultiSigFactory {

    // MultiSigWallet用の配列
    SimpleMultiSig[] private _simpleMultiSigs;
    // マルチシグウォレットが生成された時のイベント
    event MultiSigCreated (SimpleMultiSig indexed simpleMultiSig, string walletName,uint indexed threshold, address[] owners, uint indexed chainId);

    /**
     * マルチシグウォレット生成関数
     */
    function createMultiSig (string memory walletName_, uint threshold_, address[] memory owners_, uint chainId) public {
        // インスタンスを生成
        SimpleMultiSig simpleMultiSig = new SimpleMultiSig(walletName_, threshold_, owners_, chainId);
        // 生成したマルチシグウォレットを配列に格納する。
        _simpleMultiSigs.push(simpleMultiSig);
        // イベントの発行
        emit MultiSigCreated(simpleMultiSig, walletName_, threshold_, owners_, chainId);
    }

    /**
     * 作成済みマルチシグウォレット数を取得する関数
     */
    function multiSigWalletsCount () public view returns (uint256) {
        return _simpleMultiSigs.length;
    }
}