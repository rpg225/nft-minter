// scritps/deploy.js

const { ethers } = require("hardhat");

async function main() {
    // get deployer account
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:",(await
        ethers.provider.getBalance(deployer.address)
    ).toString());

    const MyNFTFactory = await ethers.getContractFactory("MyNFT");

    console.log("Deploying MyNFT");
    const myNFT = await MyNFTFactory.deploy();

    await myNFT.waitForDeployment();

    // log addres of the deployed contract

    const contractAddress = myNFT.target;

    console.log("MyNFT deployed to:", contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });