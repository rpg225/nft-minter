// frontend/src/components/NFTGallery.jsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFTContractABI from '../MyNFTABI.json'; 
import { MYNFT_CONTRACT_ADDRESS } from '../config';

// Helper function to convert IPFS URI to an HTTP Gateway URL
const formatIpfsUrl = (ipfsUri) => {
    if (!ipfsUri || !ipfsUri.startsWith('ipfs://')) {
        return ipfsUri;
    }
    const cid = ipfsUri.substring(7); 
    return `https://gateway.pinata.cloud/ipfs/${cid}`; 
};

function NFTGallery({ currentAccount }) {
    const [userNFTs, setUserNFTs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserNFTs = async () => {
            // This initial check for currentAccount is good
            if (!currentAccount) {
                setUserNFTs([]);
                setIsLoading(false); // Ensure loading is false if no account
                return;
            }

            setIsLoading(true);
            setErrorMessage('');
            setUserNFTs([]); // Clear previous NFTs

            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const nftContract = new ethers.Contract(MYNFT_CONTRACT_ADDRESS, MyNFTContractABI, provider);

                const balance = await nftContract.balanceOf(currentAccount);
                console.log(`User ${currentAccount} has ${balance.toString()} NFTs.`);

                const nftsData = [];
                for (let i = 0; i < balance; i++) {
                    try {
                        const tokenId = await nftContract.tokenOfOwnerByIndex(currentAccount, i);
                        const rawTokenURI = await nftContract.tokenURI(tokenId);
                        
                        console.log(`Token ID: ${tokenId.toString()}, Raw Token URI: ${rawTokenURI}`);

                        if (rawTokenURI) {
                            const metadataHttpUrl = formatIpfsUrl(rawTokenURI);
                            console.log(`Fetching metadata from: ${metadataHttpUrl}`);
                            
                            // --- THIS IS THE CRUCIAL METADATA FETCHING BLOCK ---
                            const metadataResponse = await fetch(metadataHttpUrl);
                            if (!metadataResponse.ok) {
                                console.error(`Failed to fetch metadata for ${tokenId.toString()}: ${metadataResponse.status} ${metadataResponse.statusText}`);
                                nftsData.push({
                                    id: tokenId.toString(),
                                    uri: rawTokenURI,
                                    name: `NFT #${tokenId.toString()}`,
                                    description: "Metadata fetch failed.",
                                    image: null, 
                                });
                                continue; 
                            }
                            const metadata = await metadataResponse.json();
                            console.log(`Metadata for Token ID ${tokenId.toString()}:`, metadata);
                            // --- END OF METADATA FETCHING BLOCK ---

                            nftsData.push({
                                id: tokenId.toString(),
                                uri: rawTokenURI,
                                name: metadata.name || `NFT #${tokenId.toString()}`,
                                description: metadata.description || "No description.",
                                image: metadata.image ? formatIpfsUrl(metadata.image) : null, 
                            });
                        } else {
                             nftsData.push({
                                id: tokenId.toString(),
                                uri: '',
                                name: `NFT #${tokenId.toString()}`,
                                description: "No URI found.",
                                image: null,
                            });
                        }
                    } catch (loopError) {
                        console.error(`Error processing NFT at index ${i} (Token ID: unknown at this point if tokenId failed):`, loopError);
                    }
                }
                setUserNFTs(nftsData);
            } catch (error) {
                console.error('Error fetching user NFTs list:', error); // More specific error context
                let displayError = 'Error fetching your NFTs. ';
                if (error.reason) { displayError += error.reason; }
                else if (error.message) { displayError += error.message; }
                setErrorMessage(displayError);
            } finally {
                setIsLoading(false);
            }
        };

        // Moved fetchUserNFTs call here to be consistent with your previous version
        if (currentAccount) { 
            fetchUserNFTs();
        } else {
            // This setUserNFTs() call is problematic, it should be setUserNFTs([])
            setUserNFTs([]); // Clear NFTs if account disconnects
            setIsLoading(false); // Also ensure loading is false
        }
    }, [currentAccount]);

    // JSX for loading, error, and no account states
    if (!currentAccount) {
        return <p className="warning-message">Connect your wallet to see your NFTs.</p>; // Added class for consistency
    }
    if (isLoading) {
        return <p className="status-message">Loading your NFTs...</p>; // Used status-message class
    }
    if (errorMessage) {
        // The inline style was overriding the class, let's rely on the class
        return <p className="error-message">{errorMessage}</p>; 
    }

    // Main JSX for displaying NFTs
  return (
    <div className="nft-gallery-container">
        <h2>Your Minted NFTs</h2>
        {/* ... (loading, error, no account, no nfts messages) ... */}
        {currentAccount && !isLoading && !errorMessage && userNFTs.length > 0 && (
            <div className="nfts-grid">
                {userNFTs.map((nft) => (
                    <div key={nft.id} className="nft-card">
                        {nft.image ? (
                            <img 
                                src={nft.image} 
                                alt={nft.name || `NFT ${nft.id}`} 
                                // Removed inline styles for img, will be handled by .nft-card img in CSS
                                onError={(e) => { 
                                    console.error(`Error loading image: ${nft.image}`, e);
                                    // Replace with placeholder div on error
                                    const parent = e.target.parentNode;
                                    const placeholder = document.createElement('div');
                                    placeholder.className = 'no-image-placeholder';
                                    placeholder.innerHTML = '<p>Image Load Error</p>';
                                    if (parent && e.target.nextSibling !== placeholder) { // Avoid multiple placeholders
                                        parent.insertBefore(placeholder, e.target);
                                    }
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="no-image-placeholder"> {/* Added class */}
                                <p>No Image Provided</p>
                            </div>
                        )}
                        <div className="card-content"> {/* Wrapper for text content */}
                            <h4>{nft.name || `Token ID: ${nft.id}`}</h4>
                            <p className="description">{nft.description}</p> {/* Class for description */}
                            <p className="token-id-display">Token ID: {nft.id}</p> {/* Class for token ID */}
                            <p className="nft-uri" style={{marginTop: '5px'}}>
                                <a href={formatIpfsUrl(nft.uri)} target="_blank" rel="noopener noreferrer" className="metadata-link"> {/* Class for link */}
                                    View Raw Metadata
                                </a>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);
}
export default NFTGallery;