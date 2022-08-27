require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const private_key = process.env.PRIVATEKEY;
const project_id = process.env.INFURA_PROJECT_ID;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {                         
    artifacts: './../../client/src/contracts',  
  },
  networks: {     
    // ローカル設定用
    hardhat: {
      chainId: 1338            
    },
    // Ropsten用
    ropsten: {
      url: `https://ropsten.infura.io/v3/${project_id}`,   
      accounts: [
        private_key
      ]
    },
    // Rinkeby用の設定
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${project_id}`,   
      accounts: [
        private_key
      ]
    },
  },
  // 最適化の設定
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
