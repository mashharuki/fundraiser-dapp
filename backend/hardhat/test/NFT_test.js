/**
 * テストコード用のファイル
 */

// 必要なモジュールをインポートする。
const { expect } = require("chai");

/**
 * 以下、NFTコントラクトのテストコード
 */
describe("NFT", function() {
    // 基本テストを実装する。
    it("NFT basic test", async function() {
        // 署名者の情報を定義する。
        const [signer, badSigner] = await ethers.getSigners();
        // NFTコントラクトの情報を読み取る
        const NFT = await ethers.getContractFactory("NFT");
        // デプロイする。
        const nft = await NFT.deploy();
        // コントラクトがデプロイできているかチェックする。
        expect(await nft.name()).to.equal("name");
        // NFTを発行する。
        await nft.mint(signer.address);
        // minter以外がNFTを発行していないかチェックする。
        expect(await nft.balanceOf(signer.address)).to.equal(1);
        await expect(nft.connect(badSigner).mint(signer.address)).to.revertedWith("ERC721PresetMinterPauserAutoId: must have minter role to mint")
    });
});
