import { useState } from 'react'
import './App.css'
import WalletConnect from './components/WalletConnect'
import NFTMinter from './components/NFTMinter'
import NFTGallery  from './components/NFTGallery'


function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  return (
    <>
      <div className="App">
        <h1>My NFT Minter App</h1>
          <WalletConnect
            currentAccount={currentAccount}
            setCurrentAccount={setCurrentAccount}
           />
           <hr />
      {currentAccount ? (
        <>
        <NFTMinter currentAccount={currentAccount} />
        <NFTGallery currentAccount={currentAccount} />
        </>
      ) : ( 
        <p>please connect your wallet to use the minter</p>
      )}
      </div>
    </>
  );
}

export default App
