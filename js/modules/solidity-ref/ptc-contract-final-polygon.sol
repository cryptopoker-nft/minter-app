// Contract based on https://docs.openzeppelin.com/contracts/4.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// RINKBY: 0x910d50222B727a9151537586B79C5969219ca663

contract ptcNFT is ERC721URIStorage, Ownable {
   using Counters for Counters.Counter;
   Counters.Counter private _tokenIdCounter;

   mapping(string => uint8) public existingURIs;

   constructor() ERC721("ptcNFT 2022", "PTC") { }

   function safeMint(address to, string memory uri) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);

   }

   function payToMint(address recipient, string memory metadataURI) public payable returns(uint256) {
    // require (existingURIs[metadataURI] != 1, "Token has already been minted!");
    // require (existingURIs[metadataURI] != 1, "YOU ALREADY OWN THIS TOKEN.");
    require (msg.value >= 0.000001 ether, "Cost to mint exceeds cost provided.");

    uint256 newItemId = _tokenIdCounter.current();      // get and increment the counter
    _tokenIdCounter.increment();
    existingURIs[metadataURI] = 1;      // assign to 1 for taken

    _mint(recipient, newItemId);
    _setTokenURI(newItemId, metadataURI);

    return newItemId;
   }

   function isContentOwned(string memory uri) public view returns (bool) {
    return existingURIs[uri] == 1;
   }

   function count() public view returns (uint256) {
    return _tokenIdCounter.current();
   }

}