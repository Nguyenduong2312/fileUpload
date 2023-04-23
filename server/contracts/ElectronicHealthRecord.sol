// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract ElectronicHealthRecord {
    struct EHR{
        address sender;
        address owner;
        string ehrLink;
        string encryptedKey;
    }

    mapping(uint256 => EHR) public ehrs;

    uint256 public numberOfRecords = 0;

    function createEHR(address _owner, string memory _ehrLink, string memory _encryptedKey) public returns (uint256){
        EHR storage ehr = ehrs[numberOfRecords];
        ehr.sender = msg.sender;
        ehr.owner = _owner;
        ehr.ehrLink = _ehrLink;
        ehr.encryptedKey = _encryptedKey;
        numberOfRecords++;
        return numberOfRecords - 1; // return the uint key of the ehr
    }

    function updateEHR(uint256 idx, address _owner, string memory _ehrLink, string memory _encryptedKey) public returns (uint256){
        ehrs[idx].sender = msg.sender;
        ehrs[idx].owner = _owner;
        ehrs[idx].ehrLink = _ehrLink;
        ehrs[idx].encryptedKey = _encryptedKey;
        return idx;
    }

    function deleteEHR(uint256 idx)public returns (uint256){
        for(uint256 i = idx; i < numberOfRecords; i++)
        {
            ehrs[i] = ehrs[i+1];
        }
        numberOfRecords -= 1;
        return idx;
    }
}