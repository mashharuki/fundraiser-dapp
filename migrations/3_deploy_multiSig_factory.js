/**
 * マルチシグウォレットコントラクトデプロイJsファイル
 */

const MultiSigFactoryContract = artifacts.require("MultiSigFactory");

/**
 * コントラクトをデプロイする。
 * @param {*} deployer 
 */
module.exports = function (deployer) {
    // デプロイする。
    deployer.deploy(MultiSigFactoryContract);
}