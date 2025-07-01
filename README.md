# Web3 NFT Minter DApp (Sepolia Testnet)

## Project Description

This project is a decentralized application (DApp) that allows users to connect their Ethereum wallet (MetaMask), mint custom Non-Fungible Tokens (NFTs) with associated metadata (name, description, image), and view their minted NFTs in a gallery. The NFTs are minted on the Ethereum Sepolia testnet, and their metadata is stored decentrally on IPFS via Pinata.

This DApp was built as a learning project to understand and implement core Web3 functionalities, including smart contract development, frontend-blockchain interaction, and metadata handling for NFTs.


## Live Demo
 
 https://rpg225.github.io/nft-minter/

---

## Features

*   **Wallet Connection:** Connect to user's MetaMask wallet.
*   **Network Detection:** (Implicitly handles Sepolia via configuration, user must be on Sepolia).
*   **NFT Minting:**
    *   Input fields for NFT Name, Description, and Image URL.
    *   Constructs JSON metadata based on user input.
    *   Uploads JSON metadata to IPFS via Pinata API.
    *   Mints the NFT on the Sepolia testnet, storing the IPFS metadata URI on-chain.
*   **NFT Gallery:**
    *   Displays NFTs owned by the connected user from this specific contract.
    *   Fetches metadata from IPFS to display NFT image, name, and description.
*   **User Feedback:** Provides status messages for minting progress, success, and errors.
*   **Responsive Design:** Basic mobile responsiveness for usability on different screen sizes.

---

## Tech Stack

**Smart Contract (Backend):**
*   **Solidity:** Language for smart contract development.
*   **Hardhat:** Ethereum development environment (compilation, deployment, testing).
*   **OpenZeppelin Contracts:** For standard, secure ERC721 (Enumerable, URIStorage, Ownable) implementations.
*   **Ethereum Sepolia Testnet:** The blockchain network used for deployment and testing.

**Frontend:**
*   **React:** JavaScript library for building user interfaces (using Vite).
*   **Vite:** Fast frontend build tool and development server.
*   **Ethers.js (v6):** Library for interacting with the Ethereum blockchain and wallets.
*   **Pinata API:** For pinning NFT metadata to IPFS.
*   **CSS3:** For styling (custom CSS).
*   **JavaScript (ES6+):** Core language for frontend logic.

**Development Tools:**
*   **Node.js & npm:** JavaScript runtime and package manager.
*   **MetaMask:** Browser extension wallet for interacting with the DApp.
*   **VS Code:** Code editor.
*   **Git & GitHub:** Version control and code hosting.
*   **GitHub Desktop (as mentioned by user):** GUI for Git.

---

## Project Structure

nft-minter/
├── contracts/ # Solidity smart contracts
│ └── MyNFT.sol
├── frontend/ # React frontend application (Vite)
│ ├── public/
│ ├── src/
│ │ ├── components/ # React components (WalletConnect, NFTMinter, NFTGallery)
│ │ ├── MyNFTABI.json # Contract ABI for frontend interaction
│ │ ├── config.js # Frontend configuration (e.g., contract address)
│ │ ├── App.css # Component-specific styles
│ │ ├── App.jsx
│ │ ├── index.css # Global styles
│ │ └── main.jsx
│ ├── .env # Frontend environment variables (VITE_ PINATA keys - GITIGNORED)
│ ├── .gitignore # Git ignore for frontend
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
├── scripts/ # Hardhat deployment scripts
│ └── deploy.js
├── test/ # Hardhat tests (if any were written)
├── .env # Hardhat environment variables (RPC URL, Private Key - GITIGNORED)
├── .gitignore # Root Git ignore
├── hardhat.config.js # Hardhat configuration
├── package.json # Hardhat project dependencies
└── README.md # This file

