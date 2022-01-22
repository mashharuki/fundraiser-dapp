/**
 * SafeContractFactoryコントラクトデプロイ用のファイル
 */

const SafeContractFactoryContract = artifacts.require("SafeContractFactory");

/**
 * SafeContractFactoryコントラクトをデプロイする。
 */
module.exports = function (deployer) {
    // デプロイする。
    deployer.deploy(SafeContractFactoryContract);
}