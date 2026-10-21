// Contract based on https://docs.openzeppelin.com/contracts/4.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// RINKBY: 0x08e9F7743EeD864C1D659eD5c404ecd3F6c56c64

contract cpNFT is ERC721URIStorage, Ownable {
   using Counters for Counters.Counter;
   Counters.Counter private _tokenIdCounter;

   // Payable address can receive Ether
   address payable public contractOwner;

   constructor() payable {
      contractOwner = payable(msg.sender);
   }

   function deposit() public payable {}

   // Function to withdraw all Ether from this contract.
   function withdraw() onlyOwner public {
      // get the amount of Ether stored in this contract
      uint amount = address(this).balance;

      // send all Ether to owner
      // Owner can receive Ether since the address of owner is payable
      (bool success, ) = contractOwner.call{value: amount}("");
      require(success, "Failed to send Ether");
   }

   // alt option for wd function
   /*

   function withdraw() onlyOwner public {
      address myAddress = this;
      uint256 etherBalance = myAddress.balance;
      owner.transfer(etherBalance)
   }

   */

   // function burn(uint tokenId) external {
   //    address burnOwner = ownerOf(tokenId);

   //    _approve(burnOwner, address(0), tokenId);

   //    // _balances[burnOwner] -= 1;
   //    delete _owners[tokenId];

   //    emit Transfer(owner, address(0), tokenId);
   // }

   mapping(string => uint8) public existingURIs;

   constructor() ERC721("Cryptopoker Hand", "cpNFT") { }

   function safeMint(address to, string memory uri) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);

   }

   function payToMint(address recipient, string memory metadataURI) public payable returns(uint256) {
    require (existingURIs[metadataURI] != 1, "Token has already been minted!");
    // require (existingURIs[metadataURI] != 1, "YOU ALREADY OWN THIS TOKEN.");
    require (balanceOf(recipient) > 5, "YOU ALREADY HOLD TOO MANY HANDS.");
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