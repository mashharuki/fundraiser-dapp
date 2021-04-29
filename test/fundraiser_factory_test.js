// FundraiserFactoryコントラクト用のテストコード

// FundraiserFactoryコントラクトを読み込んでインスタンス化する。
const FundraiserFactoryContract = artifacts.require("FundraiserFactory");
// Fundraiserコントラクトを読み込んでインスタンス化する。
const FundraiserContract = artifacts.require("Fundraiser");

// コントラクトのデプロイ用テストコード
contract ("FundraiserFactory: deployment", () => {
    it ("has been deployde", async () => {
        const fundraiserFactory = FundraiserFactoryContract.deployed();
        assert(fundraiserFactory, "fundraiser factory was not deployed") 
    });
});

// Fundraiserコントラクトインスタンス作成用テストコード
contract ("FundraiserFactory: createfundraiser", (accounts) => {
    let fundraiserFactory;
    // 以下、fundraiserの引数
    // 受取人の名前
    const name = "Beneficiary Name";
    // 詳細を確認できるURL
    const url = "beneficiaryname.org";
    // 画像のURL
    const imageURL = "https://placekitten.com/600/350";
    // 簡単な説明
    const description = "Beneficiary description";
    // 受取人のアドレス
    const beneficiary = accounts[1];

    // Fundraiserコントラクトを作成するテストコード
    it ("increments the fundraisersCount", async () => {
        fundraiserFactory = await FundraiserFactoryContract.deployed();
        // インスタンスの数を取得する。
        const currentFundraisersCount = await fundraiserFactory.fundraisersCount();
        // インスタンスを作成する。
        await fundraiserFactory.createFundraiser(name, url, imageURL, description, beneficiary);
        // インスタンスの数を取得する。
        const newFundraisersCount = await fundraiserFactory.fundraisersCount();
        // 差異を確認する。
        assert.equal((newFundraisersCount - currentFundraisersCount), 1, "should increment by 1");
    });

    // イベントが発行されているかテストコード
    it ("emits the FundraiserCreated event", async () => {
        fundraiserFactory = await FundraiserFactoryContract.deployed();
        // インスタンスを作成する。
        const tx = await fundraiserFactory.createFundraiser(name, url, imageURL, description, beneficiary);
        const expectedEvent = "FundraiserCreated";
        const actualEvent = tx.logs[0].event;
        assert.equal(actualEvent, expectedEvent, "events should match");
    });
});

// Fundraiserコントラクトインスタンスページング作成用テストコード
contract ("FundraiserFactory: fundraisers", (accounts) => {
    // インスタンス生成関数
    async function createFundraiserFactory (fundraiserCount, accounts) {
        // インスタンス初期化
        const factory = await FundraiserFactoryContract.new();
        // addFundraisers関数を呼び出し
        await addFundraisers (factory, fundraiserCount, accounts);
        return factory;
    }
    
    /**
     * addFundraisers関数
     */
    async function addFundraisers (factory, count, accounts) {
        // 変数を初期化
        const name = "Beneficiary";
        const lowerCaseName = name.toLowerCase();
        const beneficiary = accounts[1];

        for (let i=0; i < count; i++) {
            // インスタンスを生成
            await factory.createFundraiser (`${name} ${i}`, `${lowerCaseName}${i}.com`, `${lowerCaseName}${i}.png`, `Description for ${name} ${i}`, beneficiary);
        }
    }

    // 空のコレクションでページングするテストコード
    describe ("when fundraisers collection is empty", () => {
        it ("returns an empty collection", async () => {
            // インスタンス生成
            const factory = await createFundraiserFactory (0, accounts);
            // fundraisers関数を呼び出し
            const fundraisers = await factory.fundraisers (10, 0);
            assert.equal(fundraisers.length, 0, "collection should be empty");
        });
    });

    // 上限値についてのテストコード
    describe ("varying limits", async () => {
        // インスタンス用の変数
        let factory;

        // テスト前の設定
        beforeEach (async () => {
            // インスタンスを生成
            factory = await createFundraiserFactory(30, accounts);
        });
        // 10個のインスタンスを返すかテスト
        it ("returns 10 results when limit requested is 10", async () => {
            const fundraisers = await factory.fundraisers(10, 0);
            assert.equal(fundraisers.length, 10, "results size should be 10");
        });
        // xit はテストに「保留中」のマークをつける。
        it ("returns 20 results when limit requested is 20", async () => {
            const fundraisers = await factory.fundraisers(20, 0);
            assert.equal(fundraisers.length, 20, "results size should be 20");
        });

        it ("returns 20 results when limit requested is 30", async () => {
            const fundraisers = await factory.fundraisers(30, 0);
            assert.equal(fundraisers.length, 20, "results size should be 20");
        });
    });

    // オフセットについてのテストコード
    describe ("varying offset", async () => {
        // テスト前の設定
        beforeEach (async () => {
            // インスタンスを生成
            factory = await createFundraiserFactory(10, accounts);
        });
  
        it ("contains the fundraiser with the appropriate offset", async () => {
            const fundraisers = await factory.fundraisers(1, 0);
            const fundraiser = FundraiserContract.at(fundraisers[0]);
            const name = await fundraiser.name();
            assert.ok(await name.includes(0), `${name} did not include the offset`);
        });

        it ("contains the fundraiser with the appropriate offset", async () => {
            const fundraisers = await factory.fundraisers(1, 7);
            const fundraiser = FundraiserContract.at(fundraisers[0]);
            const name = await fundraiser.name();
            assert.ok(await name.includes(7), `${name} did not include the offset`);
        });
    });

    // 境界値についてのテストコード
    describe ("boundary conditions", async () => {
        // インスタンス用の変数
        let factory;
        // テスト前の設定
        beforeEach (async () => {
            // インスタンスを生成
            factory = await createFundraiserFactory(10, accounts);
        });
        it ("raises out of bounds error", async () => {
            try {
                await factory.fundraisers(1, 11);
                assert.fail("error was not raised");
            } catch (err) {
                const expected = "offset out of bounds";
                assert.ok(err.message.includes(expected), `${err.message}`);
            }
        });
        it ("adjusts return size to prevent out of bounds error", async () => {
            try {
                const fundraisers = await factory.fundraisers(10, 5);
                assert.equal(fundraisers.length, 5, "collection adjusted");
            } catch (err) {
                assert.fail("limit and offset exceeded bounds");
            }
        });
    });
});