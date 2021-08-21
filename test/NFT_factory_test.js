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

/**
 * NFTコントラクトインスタンスページング作成用テストコード
 */
contract ("NFTFactory: nfts", (accounts) => {
    /**
     * テスト用のインスタンス生成関数
     */
    async function createNFTFactory (nftCount) {
        // インスタンス初期化
        const factory = await NFTFactoryContract.new();
        // addNFTs関数を呼び出し
        await addNFTs (factory, nftCount);
        return factory;
    }

    /**
     * addNFTs関数
     */
     async function addNFTs (factory, count) {
        // テスト用の変数を初期化
        const name = "test NFT";
        const symbol = "test";
        const url = "http://localhost:3000/";

        for (let i=0; i < count; i++) {
            // インスタンスを生成
            await factory.createNFT (`${name} ${i}`, `${symbol}${i}`, `${url}${i}`);
        }
    }

    /**
     * 空のコレクションが作成できるかチェックする。
     */
    describe ("when NFTs collection is empty", () => {
        it ("returns an empty collection", async () => {
            // インスタンス生成
            const factory = await createNFTFactory (0);
            // nfts関数を呼び出し
            const nfts = await factory.nfts (10, 0);
            // コレクションが0個かチェックする。
            assert.equal(nfts.length, 0, "collection should be empty");
        });
    });

    /**
     * 上限値をテストするコード
     */
    describe ("varying limits", async () => {
        // インスタンス用の変数
        let factory;
        // テスト前の設定
        beforeEach (async () => {
            // インスタンスを生成
            factory = await createNFTFactory(30);
        });
        // 10個のインスタンスを返すかテスト
        it ("returns 10 results when limit requested is 10", async () => {
            const nfts = await factory.nfts(10, 0);
            assert.equal(nfts.length, 10, "results size should be 10");
        });
        // xit はテストに「保留中」のマークをつける。
        it ("returns 20 results when limit requested is 20", async () => {
            const nfts = await factory.nfts(20, 0);
            assert.equal(nftss.length, 20, "results size should be 20");
        });

        it ("returns 20 results when limit requested is 30", async () => {
            const nfts = await factory.nfts(30, 0);
            assert.equal(nfts.length, 20, "results size should be 20");
        });
    });

    /**
     * offsetについてのテストコード
     */
    describe ("varying offset", async () => {
        // テスト前の設定
        beforeEach (async () => {
            // インスタンスを生成
            factory = await createNFTFactory(10);
        });
  
        it ("contains NFT with the appropriate offset", async () => {
            const nfts = await factory.nfts(1, 0);
            const nft = NFTContract.at(nfts[0]);
            const name = await nft.name();
            assert.ok(await name.includes(0), `${name} did not include the offset`);
        });

        it ("contains NFT with the appropriate offset", async () => {
            const nfts = await factory.nfts(1, 7);
            const nft = NFTContract.at(nfts[0]);
            const name = await nft.name();
            assert.ok(await name.includes(7), `${name} did not include the offset`);
        });
    });

    /**
     * 境界値についてのテストコード
     */
    describe ("boundary conditions", async () => {
        // インスタンス用の変数
        let factory;
        // テスト前の設定
        beforeEach (async () => {
            // インスタンスを生成
            factory = await createNFTFactory(10);
        });
        it ("raises out of bounds error", async () => {
            try {
                await factory.nfts(1, 11);
                assert.fail("error was not raised");
            } catch (err) {
                const expected = "offset out of bounds";
                assert.ok(err.message.includes(expected), `${err.message}`);
            }
        });
        it ("adjusts return size to prevent out of bounds error", async () => {
            try {
                const nfts = await factory.nfts(10, 5);
                assert.equal(nfts.length, 5, "collection adjusted");
            } catch (err) {
                assert.fail("limit and offset exceeded bounds");
            }
        });
    });
});