pragma solidity >= 0.4.22;

import "./Rot13Encryption.sol";

/**
 * 極秘事項を暗号化するコントラクト
 */
contract EncryptionContract {
    // 暗号化コントラクトをインスタンスか
    Rot13Encryption encryptionLibrary;

    // コンストラクター
    constructor () {
        // インスタンス化
        encryptionLibrary = new Rot13Encryption();
    }
    
    /**
     * 暗号化するための関数
     */
    function encryptPrivateData (string privateInfo) {
        // 暗号化するための関数を呼び出す。
        encryptionLibrary.rot13Encrypt(privateInfo);
     }
 }