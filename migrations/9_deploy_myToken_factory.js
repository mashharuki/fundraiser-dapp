/**
 * MyTokenFactoryコントラクトデプロイ用JSファイル
 */ 

// MyTokenFactoryコントラクトを読み込んでインスタンス化する。
const MyTokenFactoryContract = artifacts.require("MyTokenFactory");

module.exports = function (deployer) {
    // コントラクトをデプロイする。
    deployer.deploy (MyTokenFactoryContract);
}