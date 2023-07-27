// SPDX-License-Identifier: MIT
// polygon address: 0x250DA35D189e014Cd9a393F40ba0102ef7fE4102
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.8.3/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@4.8.3/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts@4.8.3/security/Pausable.sol";
import "@openzeppelin/contracts@4.8.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.3/token/ERC20/extensions/draft-ERC20Permit.sol";

// POLYGON: 
// OP MAINNET: 0x3C402196E976964a4FeF5F07b790523Eb68C9b06
// ARBITRUM ONE: 0x85D68F3E6F945592ADc3B0F458b14814c6847592
// BASE: 0x495B33579C7a1439E2F6C95BAFCC716894a13483

/// @custom:security-contact help@justplay.cafe
contract Cryptopoker_Token is ERC20, ERC20Burnable, Pausable, Ownable, ERC20Permit {
    constructor()
        ERC20("Cryptopoker_Token", "CPT")
        ERC20Permit("Cryptopoker_Token")
    {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
