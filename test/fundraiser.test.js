// Fundraiserコントラクトテスト用のコード
// Fundraiserコントラクトを読み込んでインスタンス化する。
const FundraiserContract = artifacts.require("Fundraiser");

contract ("Fundraiser", accounts => {
    // 資金調達をするための変数
    let fundraiser;
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
    // 管理人のアドレス
    const owner = accounts[0];
    
    // テストが実行される前に資金調達を設定する。
    beforeEach (async () => {
        fundraiser = await FundraiserContract.new(name, url, imageURL, description, beneficiary, owner);
    });

    // 各変数の初期設定用テストコード
    describe ("initialization", () => {
        // 資金調達の名前とコンストラクタに渡した名前が一致していることを確認
        it ("gets the beneficiary name", async () => {
            const actual = await fundraiser.name();
            assert.equal(actual, name, "names should match");
        });
        it ("gets the beneficiary url", async () => {
            const actual = await fundraiser.url();
            assert.equal(actual, url, "url should match");
        });
        it ("gets the beneficiary imageURL", async () => {
            const actual = await fundraiser.imageURL();
            assert.equal(actual, imageURL, "imageURL should match");
        });
        it ("gets the beneficiary description", async () => {
            const actual = await fundraiser.description();
            assert.equal(actual, description, "description should match");
        });
        // 受取人のアドレスが正常かどうかチェックするテストコード
        it ("gets the beneficiary description", async () => {
            const actual = await fundraiser.beneficiary();
            assert.equal(actual, beneficiary, "beneficiary address should match");
        });
        // 管理人のアドレスが正常かどうかチェックするテストコード
        it ("gets the owner", async () => {
            const actual = await fundraiser.owner();
            assert.equal(actual, owner, "bios should match");
        });
    });

    // 受取人のアドレス設定関連のテストコードグループ
    describe ("setBeneficiary", () => {
        // 新しい受取人のアドレスを設定する。
        const newBeneficiary = accounts[2];

        it ("updated beneficiary when called by owner account", async () => {
            // setBeneficiary関数の呼び出し
            await fundraiser.setBeneficiary (newBeneficiary, {from: owner});
            // 受取人のアドレスを設定
            const actualBeneficiary = await fundraiser.beneficiary();
            assert.equal(actualBeneficiary, newBeneficiary, "beneficiaries should match");
        });
        // 所有者以外から呼び出された時にエラーを出力するかどうかチェックする。
        it ("throws an error when called from a non-owner account", async () => {
            try {
                // setBeneficiary関数の呼び出し
                await fundraiser.setBeneficiary (newBeneficiary, {from: accounts[3]});
                assert.fail("withdraw was not restricted to owners")
            } catch (err) {
                const expectedError = "Ownable: caller is not the owner";
                const actualError = err.reason;
                assert.equal(actualError, expectedError, "should not be permitted");
            }
        });
    });

    // 寄付関連機能のテストコードグループ
    describe ("making donations", () => {
        // 寄付額
        const value = web3.utils.toWei('0.0289');
        // 寄付者のアドレス
        const donor = accounts[2];

        it ("increases myDonationsCount", async () => {
            // myDonationsCount関数の呼び出し(寄付数を増やす。)
            const currentDonationsCount = await fundraiser.myDonationsCount({from: donor});
            // donate関数の呼び出し
            await fundraiser.donate({from: donor, value});
            // myDonationsCount関数の呼び出し
            const newDonationsCount = await fundraiser.myDonationsCount({from: donor});
            assert.equal(1, newDonationsCount - currentDonationsCount, "myDonationsCount should increment by 1");
        });
        // 寄付を行うテスト
        it ("include donation in myDonations", async () => {
            // 寄付関数を実行する。
            await fundraiser.donate({from: donor, value});
            // myDonations関数を呼び出す。
            const {values, dates} = await fundraiser.myDonations({from: donor});
            assert.equal(value, values[0], "values should match");
            assert (dates[0], "date should be present");
        });
        // 寄付総額を確認するテスト
        it ("increase the totalDonations amount", async () => {
            const currentTotalDonations = await fundraiser.totalDonations();
            await fundraiser.donate ({from: donor, value});
            const newTotalDonations = await fundraiser.totalDonations();
            // 差異を算出する。
            const diff = newTotalDonations - currentTotalDonations;
            assert.equal (diff, value, "difference should match the donation value");
        });

        // 寄付の件数のテスト
        it ("increase donationsCount", async () => {
            const currentTotalDonations = await fundraiser.donationsCount();
            await fundraiser.donate ({from: donor, value});
            const newTotalDonations = await fundraiser.donationsCount();
            assert.equal (1, (newTotalDonations - currentTotalDonations), "donationsCount should increment by 1");
        });
        // イベントが発行されたかのテスト
        it ("emit the DonationReceived event", async () => {
            const tx = await fundraiser.donate ({from: donor, value});
            const expectedEvent = "DonationReceived";
            const actualEvent = tx.logs[0].event;
            assert.equal (actualEvent, expectedEvent, "events should match");
        });
    });

    // 資金の引き出し機能のテストコードグループ
    describe ("withdrawing funds", () => {
        beforeEach (async () => {
            // 寄付を行う。
            await fundraiser.donate({from: accounts[2], value: web3.utils.toWei('0.1')});
        });

        // 引き出し関数用のテストコード
        describe ("withdrawing funds", () => {
            // 送金者のアドレスと所有者のアドレスが一致しているかチェックする。
            describe ("access controls", async () => {
                it ("throws an error when called from a non-owner account", async () => {
                    try {
                        await fundraiser.withdraw({from: accounts[3]});
                        assert.fail ("withdraw was not restricted to owners");
                    } catch (err) {
                        const expectedError = "Ownable: caller is not the owner";
                        const actualError = err.reason;
                        assert.equal(actualError, expectedError, "should not be permitted");
                    }
                });
                // 所有者から呼び出されていることをチェックする。
                it ("permits the owner to call the function", async () => {
                    try {
                        await fundraiser.withdraw ({from: owner});
                        assert (true, "no errors were thrown");
                    } catch (err) {
                        assert.fail ("should not have thrown an error");
                    }
                });
            });
        });

        // コントラクトの残高を受取人に送金するためのテストコード
        it ("transfers balance to beneficiary", async () => {
            // コントラクトの残高を取得する。
            const currentContractBalance = await web3.eth.getBalance(fundraiser.address);
            // 受取人の残高を取得する。
            const currentBeneficiaryBalance = await web3.eth.getBalance(beneficiary);
            // 引き出し関数の呼び出し
            await fundraiser.withdraw({from: owner});
            // コントラクトの残高を取得する。
            const newContractBalance = await web3.eth.getBalance(fundraiser.address);
            // 受取人の残高を取得する。
            const newBeneficiaryBalance = await web3.eth.getBalance(beneficiary);
            // 差異を算出する。
            const beneficiaryDifference = newBeneficiaryBalance - currentBeneficiaryBalance;
            assert.equal (newContractBalance, 0, "contract should have a 0 balance");
            assert.equal (beneficiaryDifference, currentContractBalance, "beneficiary should receive all the funds");
        });

        // イベントが発行されたかのテスト
        it ("emit Withdraw event", async () => {
            const tx = await fundraiser.withdraw({from: owner});
            const expectedEvent = "Withdraw";
            const actualEvent = tx.logs[0].event;
            // イベントが発行されたどうかチェックする。
            assert.equal (actualEvent, expectedEvent, "events should match");
        });
    });

     // フォールバック関数用のテストコードグループ
     describe ("fallback function", () => {
        // 入金額
        const value = web3.utils.toWei('0.0289');
        // 寄付総額が増加した時のテスト
        it ("increase the totalDonations amount", async () => {
            const currentTotalDonations = await fundraiser.totalDonations();
            await web3.eth.sendTransaction({to: fundraiser.address, from: accounts[9], value});
            const newTotalDonations = await fundraiser.totalDonations();
            // 差異を算出する。
            const diff = newTotalDonations - currentTotalDonations;
            assert.equal (diff, value, "difference should match the donation value");
        });
        // 寄付件数が増加した時のテスト
        it ("increase donationsCount", async () => {
            const currentTotalDonations = await fundraiser.donationsCount();
            await web3.eth.sendTransaction({to: fundraiser.address, from: accounts[9], value});
            const newTotalDonations = await fundraiser.donationsCount();
            assert.equal (1, (newTotalDonations - currentTotalDonations), "donationsCount should increment by 1");
        });
     });
});