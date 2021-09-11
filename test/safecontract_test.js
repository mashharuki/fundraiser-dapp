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
    const owners = ["0x3369AC985207BF219Dd630F1d12984a6F3B970B4", "0x553d7606dC9942260F6Edc85897a7798935EA195"];
    // 閾値
    const threshold = 2;
    // Contract address for optional delegate call
    const to = "0x49132B93cA82bA98532114Adc81fb7fC58b2A7a7";
    // Data payload for optional delegate call
    const data = "0x0000";
    // 入金者のアドレス
    const fallbackHandler = "0x49132B93cA82bA98532114Adc81fb7fC58b2A7a7";
    // 支払いに使用するトークンのアドレス(ETHを使用する場合は、0x0)
    const paymentToken  = "0x0000000000000000000000000000000000000000";
    // 支払金
    const payment = 100000;
    // 受取人のアドレス
    const paymentReceiver = "0x49132B93cA82bA98532114Adc81fb7fC58b2A7a7";

    // テストが実行される前にGnosisSafeコントラクトを生成する。
    beforeEach (async () => {
        safeContract = await SafeContract.new(walletName);
    });

    // 初期設定用テストコード
    describe ("initialization", async () => {
        it ("gets the wallet name", async () => {
            const name = await safeContract.getWalletName();
            assert.equal(name, walletName, "names should match");
        });
    });

    // セットアップ用テストコード
    describe ("set up", async () => {       
        try {
            // setup関数の呼び出し
            await safeContract.setup(owners, threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver);
            assert.fail("fail to set up")
        } catch (err) {
            console.log(err.reason);
        }
    });

    // トランザクション実行用テストコード
    describe ("execute a transaction", async () => {
        // テストに必要な変数を定義する。
        const to = "0x49132B93cA82bA98532114Adc81fb7fC58b2A7a7";
        const value = 10000;
        const data = "0x0000"
        const operation = "Call";
        const safeTxGas = "65000";
        const baseGas = "1000";
        const gasPrice = "10000";
        const gasToken = "0x0000000000000000000000000000000000000000";
        const refundReceiver = "0x49132B93cA82bA98532114Adc81fb7fC58b2A7a7";
        const signatures = "0x54654545646";

        try {
            // exectransaction関数の呼び出し
            await safeContract.execTransaction(to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, signatures);
            assert.fail("fail to execute a transaction");
        } catch (err) {
            console.log(err.reason);
        }
    });

    // トランザクションハッシュ値取得用テストコード
    describe ("get a transaction hash", async () => {

    });
});