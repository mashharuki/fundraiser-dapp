/**
 * DEXコントラクトデプロイ用JSファイル
 */ 

// DEXコントラクトを読み込んでインスタンス化する。
const DEXContract = artifacts.require("DEX");

module.exports = async function (deployer) {
    // 事前に設定するトークンのリスト(ローカル上のアドレス)
    const tokenList = [
        "0x06Dc2032695B30D0166E6f1f21C74Fe804F52553",
        "0x8dde86fCe1FBE467ec067eF49B2b018AA0D6624d"
    ];
    // コントラクトをデプロイする。
    await deployer.deploy(DEXContract, tokenList);
    console.log("tokenList:", tokenList);
}