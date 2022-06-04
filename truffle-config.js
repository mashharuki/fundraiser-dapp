/**
 * Truffle用の設定ファイル
 */
const path = require("path");
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
// const HDWalletProvider = require('@truffle/hdwallet-provider');

const { MNEMONIC, INFURA_PROJECT_ID, ALCHEMY_APIKEY } = process.env;

module.exports = {
  // コンパイルしたJSONファイルの出力先の設定
  // contracts_build_directory: path.join(__dirname, "./client/src/contracts"),
  // contracts_build_directory: path.join(__dirname, "./build"),
  // ネットワークの設定
  networks: {
    // ローカル開発用
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    // Rinkeby用
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(
          MNEMONIC,
          `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_APIKEY}`
        );
      },
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    // Ropsten用
    ropsten: {
      provider: () => {
        return new HDWalletProvider(
          MNEMONIC,
          `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_APIKEY}`
        );
      },
      network_id: 3,
      skipDryRun: true
    },
    // Goerli用
    goerli: {
      provider: () => {
        return new HDWalletProvider(
          MNEMONIC,
          `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_APIKEY}`
        );
      },
      network_id: 5,
      skipDryRun: true
    },
    // Munbai用の設定
    munbai: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  // 最適化の設定
  compilers: {
    solc: {
       version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
       settings: {          // See the solidity docs for advice about optimization and evmVersion
         optimizer: {
          enabled: true,
          runs: 200
         },
      //  evmVersion: "byzantium"
      }
    }
  }
};
