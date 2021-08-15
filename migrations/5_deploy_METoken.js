/**
 * METokenとMETFaucetコントラクトをデプロイするためのJsファイル
 */


// コントラクトを読み込む
var METoken = artifacts.require("METoken");
var METFaucet = artifacts.require("METFaucet");
// アカウント情報を読み取る
var owner = web3.eth.accounts[0];

/**
 * コントラクトをデプロイするための関数
 * @param {*} deployer 
 */
/*
module.exports = function (deployer) {
    // 最初にMETokenをデプロイする。
    deployer.deploy(METoken, {from: owner}).then(function() {
        // METFaucetをデプロイする。
        deployer.deploy(METFaucet, METoken.address, owner);
    });
}
*/
