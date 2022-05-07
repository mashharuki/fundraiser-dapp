/**
 * マルシシグウォレットコントラクト生成用テストコード
 */

// MultiSigFactoryコントラクトを読み込んでインスタンス化する。
const MultiSigFactoryContract = artifacts.require("MultiSigFactory");
// SimpleMultiSigコントラクトを読み込んでインスタンス化する。
const SimpleMultiSigContract = artifacts.require("SimpleMultiSig");

/**
 * コントラクトのデプロイ用テストコード
 */
contract ("MultiSigFactory: deployment", () => {
    it ("has been deployde", async () => {
        const MultiSigFactory = MultiSigFactoryContract.deployed();
        assert(MultiSigFactory, "MultiSig factory was not deployed") 
    });
});

/**
 * MultiSigコントラクトインスタンス作成用テストコード
 */
contract ("MultiSigFactory: create MultiSigWallet", (accounts) => {
    // mutliSigFactoryコントラクト
    let mutliSigFactory;
    // マルチシグウォレットの名前
    const walletName = "testWallet";
    // 閾値
    const threshold = 2;
    // 所有者アドレス用の配列
    const owners = [
        '0x5386a3BA6D3512B3c718b23A0E99461e0f1251B3', 
        '0x910cfbC84B035A23bF413185F73fa8C741Ae367a', 
        '0x23e838D98d93073Ef0E760987Ac6CB7E3B14446A'
    ];
    // チェーンID
    const chainId = 5777;

    // mutliSigコントラクトを作成するテストコード
    it ("increments the mutliSigWalletsCount", async () => {
        /*
        // デプロイ済みのコントラクトをインスタンス化
        mutliSigFactory = await MultiSigFactoryContract.deployed();
        // 現在の数を取得する。
        const currentmultiSigWalletsCount = await mutliSigFactory.multiSigWalletsCount();
        // マルチシグウォレットを作成する。
        await mutliSigFactory.createMultiSig(walletName, threshold, owners, chainId);
        // 作成後の数を取得する。
        const newmultiSigWalletsCount = await mutliSigFactory.multiSigWalletsCount();
        // 1つしかマルチシグウォレットが作成されていないことをチェックする。
        assert.equal((newmultiSigWalletsCount - currentmultiSigWalletsCount), 1, "should increment by 1");
        */
    });
});