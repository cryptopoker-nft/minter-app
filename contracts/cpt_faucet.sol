// SPDX-License-Identifier: MIT
// 0x75ed63fee57D4eeE8bf71a89A564BA7C6d2a1A2d
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// POLYGON: 0x75ed63fee57D4eeE8bf71a89A564BA7C6d2a1A2d
// OP Mainnet: 0xAea4b519F5145C49c65488D1F05656780D471EcB
// ARBITRUM ONE: 0x8c0b8630ABdf6bF4e9732314014b615dFEfc609B
// BASE: 0xdFaEFf1C5d26efB0A36DB2F2E2Ccc87bCDc99ABe

/// @custom:security-contact help@justplay.cafe
contract CPT_Faucet {

    address payable owner;
    IERC20 public token;

    // needs current address of deployed token on same chain
    address public tokenContractAddr = 0x85D68F3E6F945592ADc3B0F458b14814c6847592;
    uint256 public claimAmount = 5 * (10**18);
    uint256 public lockTime = 600 minutes;

    // event Withdraw(address indexed to, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount); 

    mapping(address => uint256) nextAccessTime;

    constructor() payable {
        token = IERC20(tokenContractAddr);
        owner = payable(msg.sender);
    }

    function requestTokens() public {
        require( msg.sender != address(0), "Request must not originate from zero account.");
        require(token.balanceOf(address(this)) >= claimAmount, "Insuffcient balance in faucet, please try again later.");
        require(block.timestamp >= nextAccessTime[msg.sender], "Please wait more than 10 hours before trying to claim more tokens.");
        // maybe add? require token.balanceOf(msg.sender) < X 

        nextAccessTime[msg.sender] = block.timestamp + lockTime;

        token.transfer(msg.sender, claimAmount);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function setClaimAmount(uint256 amount) public onlyOwner {
        claimAmount = amount * (10**18);
    }

    function setLockTime(uint256 time) public onlyOwner {
        lockTime = time * 1 minutes;
    }

    function withdraw() external onlyOwner {
        // emit Withdraw(msg.sender, token.balanceOf(address(this)));
        token.transfer(msg.sender, token.balanceOf(address(this)));

        // also withdraw any ETH deposited - THIS UPGRADE TESTED AND COINFIRMED
        // ARB ONLY
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw; contract balance empty");
        
        address _owner = owner;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

}
