require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // This line loads the .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // Make sure this matches your pragma solidity version
  networks: {
    hardhat: {
      // Configuration for the local Hardhat Network (default)
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "", // Get URL from .env, or empty string if not set
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [], // Get accounts from .env
    },
  },
  etherscan: {
    // Optional: For contract verification on Etherscan later
    // apiKey: process.env.ETHERSCAN_API_KEY // Get Etherscan API key from .env
  },
};