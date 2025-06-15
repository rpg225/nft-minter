import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFTContractABI from '../MyNFTABI.json'; // Your ABI file
import { MYNFT_CONTRACT_ADDRESS } from '../config';

function NFTGallery({ currentAccount }) {
    const [userNFTs, setUserNFTs ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage ] = useState('');

    useEffect(() => {
        const fetchUserNFTs = async () => {
      if (!currentAccount) {
        setUserNFTs([]); // Clear NFTs if no account is connected
        return;
      }

      setIsLoading(true);
      setErrorMessage('');
      setUserNFTs([]); // Clear previous NFTs before fetching new ones

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // No signer needed for read-only calls, but provider is fine, 
        // or you can use a generic provider if not making state changes.
        // For consistency, using provider from window.ethereum is okay.
        const nftContract = new ethers.Contract(MYNFT_CONTRACT_ADDRESS, MyNFTContractABI, provider);

        const balance = await nftContract.balanceOf(currentAccount);
        console.log(`User ${currentAccount} has ${balance.toString()} NFTs.`);

        const nfts = [];
        for (let i = 0; i < balance; i++) {
          try {
            const tokenId = await nftContract.tokenOfOwnerByIndex(currentAccount, i);
            const tokenURI = await nftContract.tokenURI(tokenId);
            nfts.push({
              id: tokenId.toString(),
              uri: tokenURI,
              // We'll add name, description, image here later when we parse real metadata
            });
          } catch (loopError) {
            console.error(`Error fetching details for NFT at index ${i}:`, loopError);
            // Optionally skip this token or add a placeholder with an error
          }
        }
        setUserNFTs(nfts);
      } catch (error) {
        console.error('Error fetching user NFTs:', error);
        let displayError = 'Error fetching your NFTs. ';
         if (error.reason) { displayError += error.reason; }
         else if (error.message) { displayError += error.message; }
        setErrorMessage(displayError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserNFTs();

}, [currentAccount]);

if (!currentAccount) {
    return <p>Connect your wallet to see your NFTs</p>
}

if (isLoading) {
    return <p>Loading your NFTs...</p>
}

if (errorMessage) {
    return <p style={{ color: 'red'}}>{errorMessage}</p>;
}



    return (
    <div className="nft-gallery-container">
      <h2>Your Minted NFTs</h2>
      {/* ... (loading, error, no account messages remain the same, can add classes too if desired) ... */}
      {/* Example for loading: */}
      {isLoading && <p className="status-message">Loading your NFTs...</p>}
        {errorMessage && !isLoading && <p className="warning-message">Connect your wallet to see your NFTs</p>}
        {!currentAccount && !isLoading && <p className="warning message">Connect your wallet to see your NFTs.</p>}
      {userNFTs.length === 0 ? (
        <p>You haven't minted any NFTs from this collection yet.</p>
      ) : (
        <div className="nft-grid"> {/* Grid container for NFTs */}
          {userNFTs.map((nft) => (
            <div key={nft.id} className="nft-card">
              <h4>Token ID: {nft.id}</h4>
              <p className="nft-uri">
                Metadata URI: 
                <a href={nft.uri} target="_blank" rel="noopener noreferrer" style={{wordBreak: 'break-all'}}>
                    {nft.uri}
                </a>
              </p>
              {/* Later, we'll display image, name, description from parsed metadata */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
  


export default NFTGallery