const chai = require("chai");
// const { ethers } = require("hardhat");
const BN = require("bn.js");
// const { expect } = chai;
chai.use(require("chai-bn")(BN));
const truffleAssert = require("truffle-assertions");

const DEX = artifacts.require("DEX");
const MyToken = artifacts.require("MyToken");

contract('DEX', accounts => {
      describe('DEX test', () => {

            let dai, link, comp, dex;
            let owner;
            let alice;
            let bob;
            // let accounts;
            
            beforeEach(async() => {
                  // create Token Contracts
                  dai = await MyToken.new("Dai", "DAI", 0);
                  link = await MyToken.new("Chainlink", "LINK", 0);
                  comp = await MyToken.new("Compound", "COMP", 0);
                  // deploy DEX contract
                  dex = await DEX.new([dai.address, link.address, comp.address]);

                  owner = accounts[0];
                  alice = accounts[1];
                  bob = accounts[2];
                  // mint
                  await dai.mint(dex.address, 1000000);
                  await link.mint(dex.address, 1000000);
                  await comp.mint(dex.address, 1000000);
            }); 
            
            
            describe("Buy token test", () => {
                  it("Should revert when invalid token address is entered", async () => {
                        const randomAddr = accounts[8];
                        await truffleAssert.reverts(
                              dex.buyToken(randomAddr, "1", "1", { value: "1" })
                        );
                  });
            
                  it("Should pass when every paramter is valid", async () => {
                        const tokenAddr = dai.address;
                        // console.log("alies:", alice)
                        await truffleAssert.passes(
                              // dex.connect(alice).buyToken(tokenAddr, "100", "10000", { value: "100" })
                              dex.buyToken(tokenAddr, "100", "10000", { from: owner ,value: "100" })
                        );

                        const ownerDai = (await dai.balanceOf(owner)).toNumber();
                        expect(ownerDai).to.be.equal(10000);
                  });
            });
            
            describe("Sell token test", async () => {
                  // テスト前の設定
                  beforeEach (async () => {
                        let amount = web3.utils.toWei('90', "ether");
                        // send eth
                        await web3.eth.sendTransaction({
                              from: accounts[6],
                              to: dex.address,
                              value: amount
                        }, function(error, hash){
                             if(error) {
                                    console.log("err:", error);
                             }else{
                                    console.log("send success! hash:", hash);
                             }
                        });
                  });

                  it("Should only pass if alice approved token transfer", async () => {
                        const tokenAddr = dai.address;
                        // mint
                        await dai.mint(alice, 200000);
                        await dai.mint(owner, 200000);
                        await dai.mint(dex.address, 1000000);

                        await truffleAssert.reverts(
                              dex.sellToken(tokenAddr, "5000", "50", {from: alice})
                        );
                  
                        await dai.approve(dex.address, "5000", {from: alice});
                  
                        await truffleAssert.passes(
                              dex.sellToken(tokenAddr, "5000", "50", {from: alice})
                        );
                  });
            });

            describe("create liquidity pool test", async () => {
                  it("create liquidity pool", async () => {
                        const tokenA = dai.address;
                        const tokenB = link.address;
                        // mint
                        await dai.mint(alice, 1000000);
                        await link.mint(alice, 1000000);
                        // approve
                        await dai.approve(dex.address, "10", {from: alice});
                        await link.approve(dex.address, "10", {from: alice});
                        // create pool
                        await truffleAssert.passes(
                              dex.createLiquidityPool(tokenA, tokenB, 10, 10, { from: alice })
                        );
                  });
            });
      });
});