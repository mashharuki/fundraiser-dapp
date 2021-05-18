// SimpleMultiSigコントラクトデプロイ用JSファイル
// SimpleMultiSigコントラクトを読み込んでインスタンス化する。
const SimpleMultiSigContract = artifacts.require("SimpleMultiSig");

module.exports = function (deployer) {
    // コントラクトをデプロイする。
    deployer.deploy (SimpleMultiSigContract, 2, ["0x5386a3BA6D3512B3c718b23A0E99461e0f1251B3", "0x910cfbC84B035A23bF413185F73fa8C741Ae367a"], 5777);
}
