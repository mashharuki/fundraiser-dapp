/**
 * NFTコントラクト生成用てすとコード
 */
// NFTFactoryコントラクトを読み込んでインスタンス化する。
const NFTFactoryContract = artifacts.require("NFTFactory");
// NFTコントラクトを読み込んでインスタンス化する。
const NFTContract = artifacts.require("NFT");

/**
 * コントラクトのデプロイ用テストコード
 */
 contract ("NFTFactory: deployment", () => {
    it ("has been deployde", async () => {
        const NFTFactory = NFTFactoryContract.deployed();
        assert(NFTFactory, "NFT factory was not deployed") 
    });
});

/**
 * NFTコントラクト作成用テストコード
 */
contract ("NFTFactory: create NFT", (accounts) => {
    // NFTFactoryコントラクト
    let NFTFactory;
    // 名前
    const name = "name";
    // シンボル
    const symbol = "symbol";
    // URL
    const url = "http://localhost:3000/"

    // NFTコントラクトを作成するテストコード
    it ("increments the NFTCount", async () => {
        // デプロイ済みのコントラクトをインスタンス化
        NFTFactory = await NFTFactoryContract.deployed();
        // 現在の数を取得する。
        const currentNFTCount = await NFTFactory.NFTsCount();
        // NFTを作成する。
        await NFTFactory.createNFT(name, symbol, url);
        // 作成後の数を取得する。
        const newNFTCount = await NFTFactory.NFTsCount();
        // 1つしかマルチシグウォレットが作成されていないことをチェックする。
        assert.equal((newNFTCount - currentNFTCount), 1, "should increment by 1");
    });
});