// FundraiserFactoryコントラクトデプロイ用JSファイル
// FundraiserFactoryコントラクトを読み込んでインスタンス化する。
const FundraiserFactoryContract = artifacts.require("FundraiserFactory");

module.exports = function (deployer) {
    // コントラクトをデプロイする。
    deployer.deploy (FundraiserFactoryContract);
}
