// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // For OpenZeppelin v4.x
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable { // Ownable from v4.x
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Constructor for OpenZeppelin v4.x Ownable
    // It takes NO arguments. msg.sender (the deployer) automatically becomes the owner.
    constructor()
        ERC721("MyNFTCollection", "MNC") 
    {}

    // ... rest of your contract ...

    function safeMint(address to, string memory uri) public onlyOwner {
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        _safeMint(to, newItemId);
        _setTokenURI(newItemId, uri);
    }

    // ... _burn, tokenURI, supportsInterface should be fine from your previous paste ...
    // Ensure they are:
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}