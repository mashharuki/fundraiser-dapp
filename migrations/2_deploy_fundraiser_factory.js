// FundraiserFactoryコントラクトデプロイ用JSファイル
// FundraiserFactoryコントラクトを読み込んでインスタンス化する。
const SimpleStorageContract = artifacts.require("SimpleStorage");
const FundraiserFactoryContract = artifacts.require("FundraiserFactory");

module.exports = function (deployer) {
    // コントラクトをデプロイする。
    deployer.deploy (SimpleStorageContract);
    deployer.deploy (FundraiserFactoryContract);
}