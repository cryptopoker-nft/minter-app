// Contract based on https://docs.openzeppelin.com/contracts/4.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// RINKBY: 0x08e9F7743EeD864C1D659eD5c404ecd3F6c56c64
// POLYGON: 0x617d4680a612CAb005223E63cB34F7dc94604C4d
// OPTIMISM: 0xF3F2675a4b6d936F53A96ACcca8569de9B35AFdE
// ARBITRUM ONE: 0xF70FdE6CdadfD287a0d5AAEBD6Ba02AE7D1b909d
// BASE: 0x70d05f50cE755FF24783a6Da9DB85cB9Bd343CC6

contract cpNFT is ERC721URIStorage, Ownable {
   using Counters for Counters.Counter;
   Counters.Counter private _tokenIdCounter;

   mapping(string => uint8) public existingURIs;

   constructor() ERC721("Cryptopoker Hand", "cpNFT") { 
      // address payable contractOwner = payable(msg.sender);
   }

   // Function to withdraw all Ether from this contract.
   function withdraw() external onlyOwner {
      // require(msg.sender == owner, "You are not the owner of this contract");
      address payable contractOwner = payable(msg.sender);
      contractOwner.transfer(address(this).balance);
   }

   function safeMint(address to, string memory uri) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);

   }

   function payToMint(address recipient, string memory metadataURI) public payable returns(uint256) {
    require (existingURIs[metadataURI] != 1, "Token has already been minted!");
    // require (existingURIs[metadataURI] != 1, "YOU ALREADY OWN THIS TOKEN.");
    // NEW
    require (balanceOf(msg.sender) < 5, "You already hold too many tokens!");
    require (msg.value >= 0.000001 ether, "Cost to mint exceeds cost provided. Send more eth");

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