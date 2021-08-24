/**
 * SafeContractFactoryコントラクトデプロイ用のファイル
 */

const SafeContractFactoryContract = artifacts.require("SafeContractFactory");

/**
 * SafeContractFactoryコントラクトをデプロイする。
 * @param {*} deployer 
 */
module.exports = function (deployer) {
    // デプロイする。
    deployer.deploy(SafeContractFactoryContract);
}