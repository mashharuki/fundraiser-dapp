/**
 * SafeContract用のproxyFactoryContractデプロイ用のファイル
 */

 const GnosisSafeProxyFactoryContract = artifacts.require("GnosisSafeProxyFactory");

 /**
  * GnosisSafeProxyContractをデプロイする。
  */
 module.exports = function (deployer) {
     // デプロイする。
     deployer.deploy(GnosisSafeProxyFactoryContract);
 }