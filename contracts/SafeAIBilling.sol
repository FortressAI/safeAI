pragma solidity ^0.8.0;

contract SafeAIBilling {
    address public owner;
    uint public feeWei;
    mapping(address => uint) public balances;

    constructor(uint _feeWei) {
        owner = msg.sender;
        feeWei = _feeWei;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function chargeForQuery(address user) external returns (bool) {
        require(msg.sender == owner, "Only safeAI can charge");
        require(balances[user] >= feeWei, "Insufficient balance");
        balances[user] -= feeWei;
        payable(owner).transfer(feeWei);
        return true;
    }
}
