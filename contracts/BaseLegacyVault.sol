// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseLegacyVault {
    address public owner;
    address public heir;
    uint256 public lastCheckIn;
    uint256 public inactivityTimeout;

    event Heartbeat(address indexed owner, uint256 timestamp);
    event InheritanceClaimed(address indexed heir, uint256 amount);

    constructor(address _heir, uint256 _timeoutSeconds) {
        owner = msg.sender;
        heir = _heir;
        inactivityTimeout = _timeoutSeconds;
        lastCheckIn = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function heartbeat() external onlyOwner {
        lastCheckIn = block.timestamp;
        emit Heartbeat(owner, lastCheckIn);
    }

    function claimInheritance() external {
        require(msg.sender == heir, "Not the designated heir");
        require(block.timestamp > lastCheckIn + inactivityTimeout, "Owner still active");

        uint256 balance = address(this).balance;
        require(balance > 0, "Vault is empty");

        (bool success, ) = payable(heir).call{value: balance}("");
        require(success, "Transfer failed");

        emit InheritanceClaimed(heir, balance);
    }

    receive() external payable {}
}
