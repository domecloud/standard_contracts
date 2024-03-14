require('hardhat-deploy');
require('hardhat-deploy-ethers');
require("@nomicfoundation/hardhat-toolbox");

const deployer = ["0x1480b838712a59c68ff4f5e1b447939b0071116a8e924730d6c93339ff0fd7a7"]; // test wallet, dont forget to prepare gas

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true // optional, occasionally make tx gas cheaper.
          }
        }
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {

    // mainnet
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 5*1e9,
      accounts: deployer
    },

    // Testnet
    ITMX_testnet1:{
      url: "https://descf-rpc.tokenine.co/",
      chainId: 19999,
      gasPrice: 10*1e9,
      accounts: deployer
    },
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      chainId: 80001,
      gasPrice: 2*1e9,
      accounts: deployer
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: 'FCCYV92JQ9SGKJ6I61EQS6YCMPE4Y316QA',
      ITMX_testnet1: 'any'
    },
    customChains: [
      {
        network: "ITMX_testnet1",
        chainId: 19999,
        urls: {
          apiURL: "https://descf-exp.tokenine.co/api",
          browserURL: "https://descf-exp.tokenine.co/"
        }
      }
    ]
  }
};
