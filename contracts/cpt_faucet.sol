// SPDX-License-Identifier: MIT
// 0x75ed63fee57D4eeE8bf71a89A564BA7C6d2a1A2d
pragma solidity ^0.8.17;

// import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// interface IERC20 {
//     function transfer(address to, uint256 amount) external returns (bool);
//     function balanceOf(address account) external view returns (uint256);
//     event Transfer(address indexed from, address indexed to, uint256 value); 
// }

/// @custom:security-contact help@justplay.cafe
contract CPT_Faucet {

    address payable owner;
    IERC20 public token;

    address public tokenContractAddr = 0x250DA35D189e014Cd9a393F40ba0102ef7fE4102;
    uint256 public claimAmount = 5 * (10**18);
    uint256 public lockTime = 60 minutes;

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
        require(block.timestamp >= nextAccessTime[msg.sender], "Please wait more than 1 hour before trying to claim more tokens.");

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
    }

    // function pause() public onlyOwner {
    //     _pause();
    // }

    // function unpause() public onlyOwner {
    //     _unpause();
    // }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

}
