// SimpleMultiSigコントラクトデプロイ用JSファイル
// SimpleMultiSigコントラクトを読み込んでインスタンス化する。
const SimpleMultiSigContract = artifacts.require("SimpleMultiSig");

module.exports = function (deployer) {
    // コントラクトをデプロイする。
    deployer.deploy (SimpleMultiSigContract);
}
