/**
 * NFTFactoryコントラクトデプロイ用JSファイル
 */ 

// NFTFactoryコントラクトを読み込んでインスタンス化する。
const NFTFactoryContract = artifacts.require("NFTFactory");

module.exports = function (deployer) {
    // コントラクトをデプロイする。
    deployer.deploy (NFTFactoryContract);
}