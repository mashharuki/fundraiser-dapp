/**
 * SafeContractコントラクト生成用テストコード
 */

// SafeContractFactoryコントラクトを読み込んでインスタンス化する。
const SafeContractFactoryContract = artifacts.require("SafeContractFactory");
// SafeContractコントラクトを読み込んでインスタンス化する。
const SafeContract = artifacts.require("GnosisSafe");

/**
 * コントラクトのデプロイ用テストコード
 */
 contract ("SafeContractFactory: deployment", () => {
    it ("has been deployde", async () => {
        const SafeContractFactory = SafeContractFactoryContract.deployed();
        assert(SafeContractFactory, "SafeContract factory was not deployed") 
    });
});

/**
 * NFTコントラクト作成用テストコード
 */
contract ("SafeContractFactory: create SafeContract", (accounts) => {
    // SafeContractFactoryコントラクト
    let SafeContractFactory;
    // 名前
    const name = "name";

    // SafeContractコントラクトを作成するテストコード
    it ("increments the SafeContractCount", async () => {
        // デプロイ済みのコントラクトをインスタンス化
        SafeContractFactory = await SafeContractFactoryContract.deployed();
        // 現在の数を取得する。
        const currentSafeContractCount = await SafeContractFactory.safeContractsCount();
        // NFTを作成する。
        await SafeContractFactory.createSafeContract(name);
        // 作成後の数を取得する。
        const newSafeContractCount = await SafeContractFactory.SafeContractsCount();
        // 1つしかマルチシグウォレットが作成されていないことをチェックする。
        assert.equal((newSafeContractCount - currentSafeContractCount), 1, "should increment by 1");
    });
});

/**
 * NFTコントラクトインスタンスページング作成用テストコード
 */
contract ("SafeContractFactory: nfts", (accounts) => {
    /**
     * テスト用のインスタンス生成関数
     */
    async function createSafeContractFactory (safeContractCount) {
        // インスタンス初期化
        const factory = await SafeContractFactoryContract.new();
        // addNFTs関数を呼び出し
        await addSafeContracts (factory, safeContractCount);
        return factory;
    }

    /**
     * addSafeContracts関数
     */
     async function addSafeContracts (factory, count) {
        // テスト用の変数を初期化
        const name = "test Wallet";

        for (let i=0; i < count; i++) {
            // インスタンスを生成
            await factory.createSafeContract(`${name} ${i}`, `${symbol}${i}`, `${url}${i}`);
        }
    }

    /**
     * 空のコレクションが作成できるかチェックする。
     */
    describe ("when createSafeContracts collection is empty", () => {
        it ("returns an empty collection", async () => {
            // インスタンス生成
            const factory = await createSafeContractFactory (0);
            // nfts関数を呼び出し
            const safeContracts = await factory.safeContracts(10, 0);
            // コレクションが0個かチェックする。
            assert.equal(safeContractss.length, 0, "collection should be empty");
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
            factory = await createSafeContractFactory(30);
        });
        // 10個のインスタンスを返すかテスト
        it ("returns 10 results when limit requested is 10", async () => {
            const safeContracts = await factory.safeContracts(10, 0);
            assert.equal(safeContracts.length, 10, "results size should be 10");
        });
        // xit はテストに「保留中」のマークをつける。
        it ("returns 20 results when limit requested is 20", async () => {
            const safeContracts = await factory.safeContracts(20, 0);
            assert.equal(safeContracts.length, 20, "results size should be 20");
        });

        it ("returns 20 results when limit requested is 30", async () => {
            const safeContracts = await factory.safeContracts(30, 0);
            assert.equal(safeContracts.length, 20, "results size should be 20");
        });
    });

    /**
     * offsetについてのテストコード
     */
    describe ("varying offset", async () => {
        // テスト前の設定
        beforeEach (async () => {
            // インスタンスを生成
            factory = await createSafeContractFactory(10);
        });
  
        it ("contains safeContracts with the appropriate offset", async () => {
            const safeContracts = await factory.safeContractss(1, 0);
            const safeContract = SafeContract.at(safeContracts[0]);
            const name = await safeContract.getWalletName();
            assert.ok(await name.includes(0), `${name} did not include the offset`);
        });

        it ("contains NFT with the appropriate offset", async () => {
            const safeContracts = await factory.safeContracts(1, 7);
            const safeContract = SafeContract.at(safeContracts[0]);
            const name = await safeContract.getWalletName();
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
            factory = await createSafeContractFactory(10);
        });
        it ("raises out of bounds error", async () => {
            try {
                await factory.safeContracts(1, 11);
                assert.fail("error was not raised");
            } catch (err) {
                const expected = "offset out of bounds";
                assert.ok(err.message.includes(expected), `${err.message}`);
            }
        });
        it ("adjusts return size to prevent out of bounds error", async () => {
            try {
                const safeContracts = await factory.safeContractss(10, 5);
                assert.equal(safeContracts.length, 5, "collection adjusted");
            } catch (err) {
                assert.fail("limit and offset exceeded bounds");
            }
        });
    });
});