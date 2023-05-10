// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract ElectronicHealthRecord {
    struct EHR{
        address sender;
        address owner;
        string cid;
        string fileName;
        string encryptedKey;
    }

    mapping(uint256 => EHR) public ehrs;

    uint256 public numberOfRecords = 0;

    function createEHR(address _owner, string memory _cid, string memory _fileName, string memory _encryptedKey) public returns (uint256){
        EHR storage ehr = ehrs[numberOfRecords];
        ehr.sender = msg.sender;
        ehr.owner = _owner;
        ehr.cid = _cid;
        ehr.fileName = _fileName;
        ehr.encryptedKey = _encryptedKey;
        numberOfRecords++;
        return numberOfRecords - 1; // return the uint key of the ehr
    }

    function updateEHR(uint256 idx, address _owner, string memory _cid, string memory _fileName, string memory _encryptedKey) public returns (uint256){
        require(idx < numberOfRecords, "The index of records is out of range");
        ehrs[idx].sender = msg.sender;
        ehrs[idx].owner = _owner;
        ehrs[idx].cid = _cid;
        ehrs[idx].fileName = _fileName;
        ehrs[idx].encryptedKey = _encryptedKey;
        return idx;
    }

    function deleteEHR(uint256 idx)public returns (uint256){
        require(idx < numberOfRecords, "The index of records is out of range");
        for(uint256 i = idx; i < numberOfRecords; i++)
        {
            ehrs[i] = ehrs[i+1];
        }
        numberOfRecords -= 1;
        return idx;
    }
}