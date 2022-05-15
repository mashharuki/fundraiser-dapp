/**
 * MyTokenコントラクト生成用テストコード
 */
// MyTokenFactoryコントラクトを読み込んでインスタンス化する。
const MyTokenFactoryContract = artifacts.require("MyTokenFactory");
// MyTokenコントラクトを読み込んでインスタンス化する。
const MyTokenContract = artifacts.require("MyToken");

/**
 * コントラクトのデプロイ用テストコード
 */
 contract ("MyTokenFactory: deployment", () => {
    it ("has been deployde", async () => {
        const MyTokenFactory = MyTokenFactoryContract.deployed();
        assert(MyTokenFactory, "MyToken factory was not deployed") 
    });
});

/**
 * MyTokenコントラクト作成用テストコード
 */
contract ("MyTokenFactory: create MyToken", (accounts) => {
    // MyTokenFactoryコントラクト
    let MyTokenFactory;
    // 名前
    const name = "name";
    // シンボル
    const symbol = "symbol";
    // 小数点桁数
    const decimal = 0;

    // MyTokenコントラクトを作成するテストコード
    it ("increments the MyTokenCount", async () => {
        // デプロイ済みのコントラクトをインスタンス化
        MyTokenFactory = await MyTokenFactoryContract.deployed();
        // 現在の数を取得する。
        const currentMyTokenCount = await MyTokenFactory.myTokensCount();
        // MyTokenを作成する。
        await MyTokenFactory.createMyToken(name, symbol, decimal);
        // 作成後の数を取得する。
        const newMyTokenCount = await MyTokenFactory.myTokensCount();
        // 1つしかマルチシグウォレットが作成されていないことをチェックする。
        assert.equal((newMyTokenCount - currentMyTokenCount), 1, "should increment by 1");
    });
});

/**
 * MyTokenコントラクトインスタンスページング作成用テストコード
 */
contract ("MyTokenFactory: MyTokens", (accounts) => {
    /**
     * テスト用のインスタンス生成関数
     */
    async function createMyTokenFactory (MyTokenCount) {
        // インスタンス初期化
        const myToken = await MyTokenFactoryContract.new();
        // addMyTokens関数を呼び出し
        await addMyTokens (myToken, MyTokenCount);
        return myToken;
    }

    /**
     * addMyTokens関数
     */
     async function addMyTokens (factory, count) {
        // テスト用の変数を初期化
        const name = "test MyToken";
        const symbol = "test";
        const decimal = "0";

        for (let i=0; i < count; i++) {
            // インスタンスを生成
            await factory.createMyToken (`${name} ${i}`, `${symbol}${i}`, `${decimal}${i}`);
        }
    }

    /**
     * 空のコレクションが作成できるかチェックする。
     */
    describe ("when MyTokens collection is empty", () => {
        it ("returns an empty collection", async () => {
            // インスタンス生成
            const factory = await createMyTokenFactory(0);
            // MyTokens関数を呼び出し
            const MyTokens = await factory.myTokens(10, 0);
            // コレクションが0個かチェックする。
            assert.equal(MyTokens.length, 0, "collection should be empty");
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
            factory = await createMyTokenFactory(30);
        });
        // 10個のインスタンスを返すかテスト
        it ("returns 10 results when limit requested is 10", async () => {
            const MyTokens = await factory.myTokens(10, 0);
            assert.equal(MyTokens.length, 10, "results size should be 10");
        });
        // xit はテストに「保留中」のマークをつける。
        it ("returns 20 results when limit requested is 20", async () => {
            const MyTokens = await factory.myTokens(20, 0);
            assert.equal(MyTokens.length, 20, "results size should be 20");
        });

        it ("returns 20 results when limit requested is 30", async () => {
            const MyTokens = await factory.myTokens(30, 0);
            assert.equal(MyTokens.length, 20, "results size should be 20");
        });
    });

    /**
     * offsetについてのテストコード
     */
    describe ("varying offset", async () => {
        // テスト前の設定
        beforeEach (async () => {
            // インスタンスを生成
            factory = await createMyTokenFactory(10);
        });
  
        it ("contains MyToken with the appropriate offset", async () => {
            const MyTokens = await factory.myTokens(1, 0);
            const MyToken = await MyTokenContract.at(MyTokens[0]);
            const name = await MyToken.name();
            assert.ok(await name.includes(0), `${name} did not include the offset`);
        });

        it ("contains MyToken with the appropriate offset", async () => {
            const MyTokens = await factory.myTokens(1, 7);
            const MyToken = await MyTokenContract.at(MyTokens[0]);
            const name = await MyToken.name();
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
            factory = await createMyTokenFactory(10);
        });
        it ("raises out of bounds error", async () => {
            try {
                await factory.myTokens(1, 11);
                assert.fail("error was not raised");
            } catch (err) {
                const expected = "offset out of bounds";
                assert.ok(err.message.includes(expected), `${err.message}`);
            }
        });
        it ("adjusts return size to prevent out of bounds error", async () => {
            try {
                const MyTokens = await factory.myTokens(10, 5);
                assert.equal(MyTokens.length, 5, "collection adjusted");
            } catch (err) {
                assert.fail("limit and offset exceeded bounds");
            }
        });
    });
});