import { useState } from "react";
import { ethers } from "ethers";
import MyNFTABI_JSON from '../MyNFTABI.json'; 
import { MYNFT_CONTRACT_ADDRESS } from "../config";

function NFTMinter({ currentAccount }) {
    const [nftName, setNftName] = useState('');
    const [nftDescription, setNftDescription] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // Using imageUrl consistently
    const [mintingStatus, setMintingStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // --- SINGLE handleMintNFT function ---
    const handleMintNFT = async () => {
        setMintingStatus('Starting mint process...'); // Initial status
        setErrorMessage('');

        // 1. Validate inputs
        if (!currentAccount) {
            setErrorMessage('Please connect your wallet first.');
            setMintingStatus('');
            return;
        }
        if (!nftName || !nftDescription || !imageUrl) {
            setErrorMessage("Please fill in all NFT details, including Image URL.");
            setMintingStatus('');
            return;
        }

        // 2. Construct Metadata JSON
        const metadata = {
            name: nftName,
            description: nftDescription,
            image: imageUrl,
            // attributes: [ { "trait_type": "Coolness", "value": "Very" } ] // Optional attributes
        };
        console.log("Constructed Metadata:", metadata);
        setMintingStatus('Metadata constructed. Uploading to IPFS via Pinata...');

        try {
            // 3. Upload JSON Metadata to Pinata
            const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
            const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY; 

            if (!pinataApiKey || !pinataSecretApiKey) {
                setErrorMessage("Pinata API Keys are not configured. Check .env file and ensure they are prefixed with VITE_");
                setMintingStatus('');
                console.error("Pinata API Keys missing or not prefixed correctly in .env");
                return;
            }

            const pinataUrl = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
            const response = await fetch(pinataUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretApiKey // Use corrected variable name
                },
                body: JSON.stringify({
                    pinataMetadata: {
                        name: `${nftName.replace(/\s+/g, '-')}-metadata.json`,
                    },
                    pinataContent: metadata 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Pinata API Error: ${response.status} - ${errorData.error?.reason || response.statusText}`);
            }

            const result = await response.json();
            const metadataIpfsHash = result.IpfsHash;
            const tokenURI = `ipfs://${metadataIpfsHash}`;

            console.log("Metadata uploaded to IPFS. CID:", metadataIpfsHash);
            console.log("Formatted TokenURI:", tokenURI);
            setMintingStatus(`Metadata on IPFS! TokenURI: ${tokenURI}. Ready to mint.`);

            // 4. Mint the NFT with the IPFS TokenURI
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const nftContract = new ethers.Contract(MYNFT_CONTRACT_ADDRESS, MyNFTABI_JSON, signer);

            setMintingStatus('Please approve the mint transaction in MetaMask...');
            console.log(`Attempting to mint NFT with actual TokenURI: ${tokenURI}`);
            
            const mintTx = await nftContract.safeMint(currentAccount, tokenURI);
            setMintingStatus('Minting on blockchain... waiting for confirmation...');
            console.log('Mint transaction sent:', mintTx.hash);

            await mintTx.wait();

            setMintingStatus(`NFT Minted successfully! Transaction Hash: ${mintTx.hash}`);
            console.log('NFT Minted!', mintTx);

            // Clear fields after successful mint
            setNftName('');
            setNftDescription('');
            setImageUrl('');

        } catch (error) {
            console.error('Error during IPFS upload or minting:', error);
            let displayError = 'An error occurred. ';
            // Consolidating error message construction
            if (error.message) { 
                displayError += error.message;
            } else if (error.data && error.data.message) { 
                displayError += error.data.message;
            } else if (error.reason) { 
                displayError += error.reason;
            }
            setErrorMessage(displayError);
            setMintingStatus(''); // Clear status on error
        }
    };
  
    return (
        <div className="nft-minter-container">
            <h2>Mint Your NFT</h2>
            {!currentAccount && <p className="warning-message">Please connect your wallet to mint.</p>}
            
            <div className="form-group">
                <label htmlFor="nftName">Name:</label>
                <input 
                    type="text"
                    id="nftName"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    disabled={!currentAccount || !!mintingStatus} // Disable if any status is active
                />
            </div>
            <div className="form-group">
                <label htmlFor="nftDescription">Description:</label>
                <textarea
                    id="nftDescription"
                    value={nftDescription}
                    onChange={(e) => setNftDescription(e.target.value)}
                    disabled={!currentAccount || !!mintingStatus}
                />
            </div>
            <div className="form-group">
                <label htmlFor="imageUrl">Image URL:</label>
                <input 
                    type="text"
                    id="imageUrl"
                    value={imageUrl}
                    placeholder="https://example.com/image.png or ipfs://..."
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={!currentAccount || !!mintingStatus}
                />
                <small>Paste a direct URL to an image (e.g., .png, .jpg, .gif)</small>
            </div>
            <button
                className="mint-button"
                onClick={handleMintNFT}
                disabled={!currentAccount || !nftName || !nftDescription || !imageUrl || !!mintingStatus}
            >
                {/* Improved button text logic */}
                {mintingStatus ? 
                    (mintingStatus.startsWith('NFT Minted') ? 'Mint Another NFT' : 'Processing...') : 
                    'Mint NFT'}
            </button>
            
            {/* Status and Error Messages - simplified display logic */}
            {mintingStatus && !mintingStatus.startsWith('NFT Minted successfully!') && 
                <p className={mintingStatus.startsWith('Please approve') ? "status-message emphasis" : "status-message"}>{mintingStatus}</p>}
            {mintingStatus.startsWith('NFT Minted successfully!') && <p className="success-message">{mintingStatus}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default NFTMinter;