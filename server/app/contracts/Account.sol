// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Account {
    address public constant admin = 0xBB346c6fFcdB09E516e2dc79b7F35bBA46106D24;

    struct accountStruct{
        string publicKey;
    }

    mapping(address => accountStruct) public accounts;

    function createAccount(address _addr, string memory _publicKey) public returns (address) {
        require(msg.sender == admin, "Only admin can create doctor account");
        accountStruct storage acc = accounts[_addr];
        acc.publicKey = _publicKey;
        return _addr;
    }
    function deleteAccount(address _addr) public returns (address) {
        require(msg.sender == admin, "Only admin can delete doctor account");
        delete accounts[_addr];
        return _addr;
    }
}//0xb8135c4C355CeB4fB73385DBB96b95F85B3891Bb