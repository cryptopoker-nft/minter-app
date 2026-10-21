// Contract based on https://docs.openzeppelin.com/contracts/4.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

// import "@openzeppelin/contracts/access/Ownable.sol";

contract Collect {
    
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    function deposit(uint256 amount) external payable {
        require(msg.value == amount, "Your deposit amount | MISMATCH");
        require(msg.value >= 0.00001 ether, "please send more than 0.00001 ether");
    }
    
    function withdraw() external {
        require(msg.sender == owner, "You are not the owner of this contract");
        msg.sender.transfer(address(this).balance);
    }
    
    // this is observable without help from the contract, could be left out or included as a courtesy
    
    function balance() external view returns(uint balanceEth) {
        balanceEth = address(this).balance;
    }
}