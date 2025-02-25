require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    myNetwork: {
      url: process.env.G2_TESTNET_RPC, // RPC URL
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC, // Sepolia RPC URL
      accounts: process.env.PRIVATE_KEY2 ? [process.env.PRIVATE_KEY2] : [],
    },
  },
};
