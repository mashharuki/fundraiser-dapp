/**
 * テストコード用のファイル
 */

// NFTFactoryコントラクトを読み込んでインスタンス化する。
const NFTFactoryContract = artifacts.require("NFTFactory");
const NFTContract = artifacts.require("NFT");

contract ("NFT test", (accounts) => {
    // NFTコントラクト用の変数
    let nft;
    // 受取人の名前
    const name = "Mash";
    // シンボル
    const symbol = "MSH";
    // 画像のURL
    const imageURL = "https://placekitten.com/600/350";
    // 簡単な説明
    const description = "This NFT is a test!!";
    // 移転先のアドレス
    const receipt = accounts[1];
    // 管理人のアドレス
    const owner = accounts[0];
    
    // 各変数の初期設定用テストコード
    describe ("initialization", async() => {
        beforeEach (async () => {
            // デプロイ済みのコントラクトをインスタンス化
            // NFTFactory = await NFTFactoryContract.deployed();
            nft = await NFTContract.new(name, symbol, imageURL);;
        });
        it ("gets the NFT name", async () => {
            const actual = await nft.getNftName();
            assert.equal(actual, name, "names should match");
        });
        it ("gets the NFT symbol", async () => {
            const actual = await nft.getNftSymbol();
            assert.equal(actual, symbol, "symbol should match");
        });
        it ("gets the NFT imageURL", async () => {
            const actual = await nft.getNftURL();
            assert.equal(actual, imageURL, "imageURL should match");
        });
    });

    // NFTの発行とそれに関連するテストコード
    describe ("mint test", async() => {
        beforeEach (async () => {
            // デプロイ済みのコントラクトをインスタンス化
            // NFTFactory = await NFTFactoryContract.deployed();
            nft = await NFTContract.new(name, symbol, imageURL);
        });
        it ("mint NFT", async () => {
            await nft.mintNft(owner, name, description, imageURL);
            const totalSupply = await nft.totalSupply();
            assert.equal(1, totalSupply, "totalSupply should match");

            const balance = await nft.balanceOf(owner);
            assert.equal(1, balance, "balance should match");

            const ownerAddress = await nft.ownerOf(1);
            assert.equal(owner, ownerAddress, "address should match");
        });
    });

    describe('indexing', async () => {
        beforeEach (async () => {
            // デプロイ済みのコントラクトをインスタンス化
            // NFTFactory = await NFTFactoryContract.deployed();
            nft = await NFTContract.new(name, symbol, imageURL);
        });
        it('lists NFT', async() => {
            await nft.mintNft(owner, name, description, imageURL);
            await nft.mintNft(owner, name, description, imageURL);
            await nft.mintNft(owner, name, description, imageURL);
            const totalSupply = await nft.totalSupply();

            let result = [];
            let metaData;

            for(let i = 1; i <= totalSupply; i++) {
                // コントラクトの配列要素にアクセス
                metaData = await nft.getMetaData(i - 1);
                result.push(metaData);
            }

            console.log("NFT lists:", result);

            let expected = [
                'data:application/json;base64,eyJuYW1lIjoiTWFzaCIsImRlc2NyaXB0aW9uIjoiVGhpcyBORlQgaXMgYSB0ZXN0ISEiLCJVUkwiOiJodHRwczovL3BsYWNla2l0dGVuLmNvbS82MDAvMzUwIn0=', 
                'data:application/json;base64,eyJuYW1lIjoiTWFzaCIsImRlc2NyaXB0aW9uIjoiVGhpcyBORlQgaXMgYSB0ZXN0ISEiLCJVUkwiOiJodHRwczovL3BsYWNla2l0dGVuLmNvbS82MDAvMzUwIn0=', 
                'data:application/json;base64,eyJuYW1lIjoiTWFzaCIsImRlc2NyaXB0aW9uIjoiVGhpcyBORlQgaXMgYSB0ZXN0ISEiLCJVUkwiOiJodHRwczovL3BsYWNla2l0dGVuLmNvbS82MDAvMzUwIn0=', 
            ];
            // 取得したメタデータとexpectedの内容が合致していること。
            assert.equal(result.join(','), expected.join(','));
        });
  });
});