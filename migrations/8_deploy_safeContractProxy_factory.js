/**
 * SafeContract用のproxy Contractデプロイ用のファイル
 */

 const GnosisSafeProxyContract = artifacts.require("GnosisSafeProxy");

 /**
  * GnosisSafeProxyContractをデプロイする。
  */
 module.exports = function (deployer) {
     // デプロイする。
     deployer.deploy(GnosisSafeProxyContract);
 }