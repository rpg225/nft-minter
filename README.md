# NFT Minter

A decentralized application (dApp) that provides a user-friendly web interface for interacting with an NFT smart contract, allowing users to connect their wallet, view collection details, and mint non-fungible tokens directly from the browser. This project serves as a foundational example for building a full-stack NFT minting experience.

## ✨ Features

*   **Wallet Integration:** Connects seamlessly with MetaMask for secure blockchain interactions.
*   **NFT Collection Overview:** Displays key contract information such as the total supply, current minted count, and minting price.
*   **Interactive Minting:** Allows users to mint NFTs with a single click after connecting their wallet.
*   **Frontend Powered by React:** A modern and responsive user interface built with React.js.
*   **Smart Contract Logic:** Backend logic for NFT minting implemented using Solidity and deployed via Hardhat.
*   **Ethers.js Integration:** Handles secure and efficient communication with the Ethereum blockchain.

## 💻 Technologies Used

### Frontend
*   **React.js:** A JavaScript library for building user interfaces.
*   **Ethers.js:** A complete, compact, and simple library for interacting with the Ethereum blockchain and its ecosystem.
*   **HTML/CSS/JavaScript:** Standard web technologies for structure, styling, and interactivity.

### Smart Contract & Development
*   **Solidity:** The primary language for writing smart contracts on Ethereum.
*   **Hardhat:** An Ethereum development environment for professionals. It facilitates testing, compiling, deploying, and debugging smart contracts.
*   **OpenZeppelin Contracts:** Industry-standard smart contracts for security and reliability (e.g., ERC721 for NFTs).

## ⚙️ Local Setup

To get this project up and running on your local machine, follow these steps:

### Prerequisites

*   **Node.js & npm/Yarn:** Make sure you have Node.js (which includes npm) or Yarn installed.
*   **MetaMask:** A browser extension for interacting with the Ethereum blockchain.
*   **Git:** For cloning the repository.

### 1. Clone the Repository

```bash
git clone https://github.com/rpg225/nft-minter.git
cd nft-minter
```

### 2. Smart Contract Development & Deployment

First, you need to set up and deploy your NFT smart contract.

1.  **Install Hardhat Dependencies:**
    ```bash
    npm install # or yarn install
    ```
2.  **Configure Hardhat:**
    *   Modify `hardhat.config.js` to include your desired network (e.g., Sepolia, Goerli, or a local Hardhat network) and your Infura/Alchemy API key, along with your private key for deployment.
    *   Example for `hardhat.config.js` (ensure sensitive info is handled securely, e.g., via environment variables):
        ```javascript
        require("@nomicfoundation/hardhat-toolbox");
        require("dotenv").config(); // If you use dotenv

        module.exports = {
          solidity: "0.8.19", // Or your contract's solidity version
          networks: {
            sepolia: {
              url: process.env.SEPOLIA_URL || "",
              accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            },
            // ... other networks
          },
        };
        ```
    *   Create a `.env` file in the root directory (if using `dotenv`) and add your variables:
        ```
        SEPOLIA_URL="YOUR_SEPOLIA_RPC_URL"
        PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"
        ```
        **Never commit your `.env` file to a public repository! Add `.env` to your `.gitignore`.**
3.  **Compile Contracts:**
    ```bash
    npx hardhat compile
    ```
4.  **Deploy Contracts:**
    *   Ensure your wallet has enough testnet ETH if deploying to a testnet.
    *   Deploy your contract to your chosen network (e.g., Sepolia):
        ```bash
        npx hardhat run scripts/deploy.js --network sepolia
        ```
    *   Note down the deployed contract address.

### 3. Frontend Configuration & Run

1.  **Install Frontend Dependencies:**
    ```bash
    npm install # or yarn install
    ```
2.  **Configure Contract Details:**
    *   Create a `.env` file in the root of the project (where `package.json` is).
    *   Add your deployed contract address and ABI details. You might need to copy the `abi.json` from `artifacts/contracts/<YourContractName>.sol/<YourContractName>.json` to your frontend's `src` folder, or configure `ethers` to fetch it.
    *   Example `.env` (adjust variable names as per your `App.js` or component logic):
        ```
        REACT_APP_CONTRACT_ADDRESS="YOUR_DEPLOYED_CONTRACT_ADDRESS"
        # If you're embedding ABI, you might not need a separate variable for it,
        # but ensure your frontend knows where to find the contract's ABI.
        ```
    *   **Again, never commit your `.env` file! Add `.env` to `.gitignore`.**
3.  **Run the Frontend:**
    ```bash
    npm start # or yarn start
    ```
    This will open the dApp in your browser, usually at `http://localhost:3000`.

## 🚀 How to Use

1.  **Open in Browser:** Navigate to `http://localhost:3000` (or wherever your app is hosted).
2.  **Connect Wallet:** Click the "Connect Wallet" button (or similar) to connect your MetaMask wallet to the dApp.
3.  **Select Network:** Ensure your MetaMask is connected to the same network where your smart contract is deployed (e.g., Sepolia Testnet).
4.  **Mint NFT:** Once connected and the contract information is loaded, click the "Mint" button to initiate a transaction and mint an NFT. Confirm the transaction in MetaMask.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/rpg225/nft-minter/issues).

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

---
