/**
 * NFTコントラクトデプロイ用JSファイル
 */ 

// NFTコントラクトを読み込んでインスタンス化する。
const NFTContract = artifacts.require("NFT");

module.exports = function (deployer) {
    // コントラクトをデプロイする。
    deployer.deploy (NFTContract);
}