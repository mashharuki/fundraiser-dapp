/**
 * GnosisSafeコントラクト用テストコード
 */

// GnosisSafeコントラクトを読み込んでインスタンス化する。
const SafeContract = artifacts.require("GnosisSafe");

// テストコード本体
contract ("GnosisSafe test", accounts => {
    // 各種変数を定義する。
    // SafeContract用の変数
    let safeContract;
    // ウォレットの名前
    const walletName = "testWallet";
    // ウォレットの所有者
    const owners = [];
    // 閾値
    const threshold = 2;
    // Contract address for optional delegate call
    const to = "";
    // Data payload for optional delegate call
    const data = "0x0000";
    // 入金者のアドレス
    const fallbackHandler = "";
    // 支払いに使用するトークンのアドレス(ETHを使用する場合は、0x0)
    const paymentToken  = "0x0000000000000000000000000000000000000000";
    // 支払金
    const payment = 100000;
    // 受取人のアドレス
    const paymentReceiver = "";

    // テストが実行される前にGnosisSafeコントラクトを生成する。
    beforeEach (async () => {
        safeContract = await SafeContract.new(walletName);
    });

    // 初期設定用テストコード
    describe ("initialization", () => {
        it ("gets the wallet name", async () => {
            const name = await safeContract.getWalletName();
            assert.equal(name, walletName, "names should match");
        });
    });

    // セットアップ用テストコード
    describe ("set up", () => {       
        try {
            // setup関数の呼び出し
            await safeContract.setup(owners, threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver, {from: accounts[0]});
            assert.fail("fail to set up")
        } catch (err) {
            console.log(err.reason);
        }
    });

    // トランザクション実行用テストコード
    describe ("execute a transaction", () => {
        // テストに必要な変数を定義する。
        const to = "";
        const value = 10000;
        const data = "0x0000"
        const operation = "Call";
        const safeTxGas = "65000";
        const baseGas = "1000";
        const gasPrice = "10000";
        const gasToken = "0x0000000000000000000000000000000000000000";
        const refundReceiver = "";
        const signatures = "";

        try {
            // exectransaction関数の呼び出し
            await safeContract.execTransaction(to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, signatures, {from: accounts[0]});
            assert.fail("fail to execute a transaction");
        } catch (err) {
            console.log(err.reason);
        }
    });

    // トランザクションハッシュ値取得用テストコード
    describe ("get a transaction hash", () => {

    });
});