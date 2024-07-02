require('hardhat-deploy');
require('hardhat-deploy-ethers');
require('@nomicfoundation/hardhat-toolbox');

const deployer = ['0x1480b838712a59c68ff4f5e1b447939b0071116a8e924730d6c93339ff0fd7a7']; // test wallet, dont forget to prepare gas

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.26',
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
    jbc: {
      url: 'https://rpc-l1.jibchain.net/',
      chainId: 8899,
      gasPrice: 1.5*1e9,
      accounts: deployer
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      gasPrice: 5*1e9,
      accounts: deployer
    },
    mumbai: {
      url: 'https://rpc.ankr.com/polygon_mumbai',
      chainId: 80001,
      gasPrice: 2*1e9,
      accounts: deployer
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: 'FCCYV92JQ9SGKJ6I61EQS6YCMPE4Y316QA',
      jbc: 'any'
    },
    customChains: [
      {
        network: 'jbc',
        chainId: 8899,
        urls: {
          apiURL: "https://exp-l1.jibchain.net/api",
          browserURL: "https://exp-l1.jibchain.net/"
        }
      }
    ]
  }
};
