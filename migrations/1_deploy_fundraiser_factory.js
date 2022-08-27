// FundraiserFactoryコントラクトデプロイ用JSファイル
// FundraiserFactoryコントラクトを読み込んでインスタンス化する。
//const SimpleStorageContract = artifacts.require("SimpleStorage");
const FundraiserFactory = artifacts.require("FundraiserFactory");

module.exports = function (deployer) {
    // コントラクトをデプロイする。
    //deployer.deploy (SimpleStorageContract,{gas:2000000});
    deployer.deploy (FundraiserFactory, {gas:2000000});
}
