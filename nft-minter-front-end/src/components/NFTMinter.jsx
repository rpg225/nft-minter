import { useState } from "react"
import { ethers } from "ethers"
import MyNFTABI_JSON from '../MyNFTABI.json';
import { MYNFT_CONTRACT_ADDRESS } from "../config"

function NFTMinter({ currentAccount }) {
    const [nftName, setNftName ] = useState('');
    const [nftDescription, setNftDescription] = useState('');
    const [nftImageURI, setNftImageURI ] = useState('');
    const [mintingStatus, setMintingStatus] = useState('');
    const [ errorMessage, setErrorMessage ] = useState('');

    const handleMintNFT = async () => {
        setMintingStatus('Preparing to mint... ');
        setErrorMessage('');

        if(!currentAccount) {
            setErrorMessage('Please connect your wallet first.');
            setMintingStatus('');
            return;
        }

        if (!nftName || !nftDescription ||  !nftImageURI) {
            setErrorMessage("Please fill in all NFT details");
            setMintingStatus('');
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const nftContract = new ethers.Contract(MYNFT_CONTRACT_ADDRESS, MyNFTABI_JSON, signer);

            const tokenURI = nftImageURI;
            setMintingStatus('Please approve the transaction in MetaMask...');
            console.log(`Attempting to mint NFT with Name: ${nftName}, Desc: ${nftDescription}, TokenURI: ${tokenURI}`);
            
            const mintTx = await nftContract.safeMint(currentAccount, tokenURI);
            setMintingStatus('Minting... waiting for transation');
            console.log('Mint transaction sent:', mintTx.hash);

            await mintTx.wait(); // wait for the transation to be minted

            setMintingStatus(`NFT Minted successfully! Transaction Hash: ${mintTx.hash} `);

            console.log('NFT Minted!', mintTx);

            setNftName('');
            setNftDescription('');
            setNftImageURI('');

        } catch  (error) {
            console.error('Error minting NFT', error );
            let displayError = 'Error minting NFT';
            if (error.data && error.data.message) {
                displayError += error.data.message;
            } else if (error.message) {
                displayError += error.message;
            } else if (error.reason) {
                displayError += error.reason;
            }
            setErrorMessage(displayError);
            setMintingStatus('');
        }

    };
  
return (
    <div className="nft-minter-container">
        <h2>Mint Your NFT</h2>
        {!currentAccount && <p className="warning-message" style={{color : 'orange'}}>Please connect your wallet to mint.</p>}
        <div className="form-group">
            <label htmlFor="nftName"> Name:</label>
            <input type="text"
                    id = "nftName"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    disabled={!currentAccount ||
                        mintingStatus.includes.apply('Minting...')

                    }
            />
        </div>
        <div className="form-group">
            <label htmlFor="nftDescription"> Description:</label>
            <textarea type="text"
                    id = "nftDescription"
                    value={nftDescription}
                    onChange={(e) => setNftDescription(e.target.value)}
                    disabled={!currentAccount ||
                        mintingStatus.includes.apply('Minting...')

                    }
            />
        </div>
        <div className="form-group">
            <label htmlFor="nftImageURI">Metadata URI: </label> 
            <input 
            type="text"
            id="nftImageURI"
            value={nftImageURI}
            placeholder="ipfs://YourMetadataCID or https://..."
            onChange={(e) => setNftImageURI(e.target.value)}
            disabled={!currentAccount || mintingStatus.includes('Minting...')} 
            />
        </div>
        <button
            className="mint-button"
            onClick={handleMintNFT}
            disabled={!currentAccount || 
                mintingStatus.includes('Minting...') || mintingStatus.startsWith('NFT Minted succesfully')
            }
        >
            {mintingStatus.includes('Minting...') ? 'minting...' : 'Mint NFT'}
        </button>
            {mintingStatus && ! mintingStatus.includes('NFT Minted successfully!') && <p>{mintingStatus}</p>}
            {mintingStatus.startsWith('NFT Minted successfully!') && <p  className="success-message" style={{color: 'green'}}>{mintingStatus}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>

  )
}

export default NFTMinter;