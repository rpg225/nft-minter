import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

function WalletConnect({ currentAccount, setCurrentAccount}) {
    // const [ currentAccount, setCurrentAccount ] = useState(null); we are using props
    const [errorMessage, setErrorMessage ] = useState(null);

    // Function to connect wallet
    const connectWalletHandler = async () => {
        setErrorMessage(null);
        if (window.ethereum && window.ethereum.isMetaMask){
            console.log('MetaMask Here!');
            try {
                // Request account access
                const accounts  = await window.ethereum.request({ method:
                    'eth_requestAccounts'
                });
                    console.log('Found account', accounts[0]);
                    setCurrentAccount(accounts[0]);

            } catch (error) {
                console.error(error);
                setErrorMessage('Error connecting to MetaMask. Please try again.');

            }
        }
        else {
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension to use this DApp');

        }
    };
    
        // Effect to check if wallet is alread connected on page load
      useEffect(() => {
            const checkIfWalletIsConnected = async () => {
                if (window.ethereum) {
                    try {
                        const accounts = await window.ethereum.request({
                            method: 'eth_accounts',
                        });
                        if (accounts.length > 0 ) {
                            setCurrentAccount(accounts[0]);
                            console.log('Wallet already connected:', accounts[0]);
                        } else {
                            console.log('No authorized account found');
                        }
                    } catch (error) {
                        console.error('Error checking for connected wallet:', error);
                    }
                }
            };
            checkIfWalletIsConnected();

            if (window.ethereum) {
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0 ) {
                        setCurrentAccount(accounts[0]);
                        console.log('Account changed to:', accounts[0]);
                    } else {
                        setCurrentAccount(null);
                        console.log('Account disconnected');
                    }
                });
            }

      }, []);

      return (
    <div className = "wallet-connect-container">
      {currentAccount ? (
        <div className="account-info">
          <p>Connected Account: {currentAccount.substring(0, 6)}...{currentAccount.substring(currentAccount.length - 4)}</p>
        </div>
      ) : (
        <button onClick={connectWalletHandler} className="connect-wallet-button">Connect Wallet</button>
      )}
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default WalletConnect;