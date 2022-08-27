/**
 * コントラクトデプロイ用のスクリプトファイル
 */
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // コントラクト読み取り
  // const FundraiserFactory = await hre.ethers.getContractFactory("FundraiserFactory");
  const NFTFactory = await hre.ethers.getContractFactory("NFTFactory");
  const MyTokenFactory = await hre.ethers.getContractFactory("MyTokenFactory");

  // 引数を指定してデプロイ
  // const fundraiserFactory = await FundraiserFactory.deploy();
   const nftFactory = await NFTFactory.deploy();
   const myTokenFactory = await MyTokenFactory.deploy();
  // await fundraiserFactory.deployed();
   await nftFactory.deployed();
   await myTokenFactory.deployed();
  // コンソール表示
  // console.log("FundraiserFactory deployed to:", fundraiserFactory.address);
   console.log("NFTFactory deployed to:", nftFactory.address);
   console.log("MyTokenFactory deployed to:", myTokenFactory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
