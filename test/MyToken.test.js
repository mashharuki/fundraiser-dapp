// MyToken コントラクトテスト用のコード
const MyToken = artifacts.require("MyToken");

contract("MyToken Contract test", accounts => {
    // トークン名
    const tokenName = "Test";
    // シンボル名
    const tokenSymbol = "TST";
    // decimal
    const decimal = 0;
    // アドレス
    const owner = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];

    let myToken;

    beforeEach (async () => {
        myToken = await MyToken.new(tokenName, tokenSymbol, decimal);
    });

    // 各変数の初期設定用テストコード
    describe ("initialization", () => {
        it ("gets the myToken name", async () => {
            const actual = await myToken.name();
            assert.equal(actual, tokenName, "name should match");
        });
        it ("gets the myToken symbol", async () => {
            const actual = await myToken.symbol();
            assert.equal(actual, tokenSymbol, "symbol should match");
        });
        it ("gets the myToken decimals", async () => {
            const actual = await myToken.decimals();
            assert.equal(actual, decimal, "decimal should match");
        });
        it ("gets the myToken totalSupply", async () => {
            const actual = await myToken.totalSupply();
            assert.equal(actual, 0, "totalSupply should match");
        });
    });

    describe ("mint tokens!!", () => {
        it("mint", async () => {
            await myToken.mint(owner, 10000);
            const actual = await myToken.totalSupply();
            const balance = await myToken.balanceOf(owner);
            assert.equal(actual, 10000, "totalSupply should match");
            assert.equal(balance, 10000, "balance should match");
        });
    });

    describe ("transfer tokens!!", () => {
        it("transfer", async () => {
            await myToken.transfer(alice, 6000);
            const balance = await myToken.balanceOf(owner);
            const balance2 = await myToken.balanceOf(alice);
            assert.equal(balance, 4000, "owner's balance should match");
            assert.equal(balance2, 6000, "alice's balance should match");
        });
    });
});