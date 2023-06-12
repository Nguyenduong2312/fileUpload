import Web3, { providers } from 'web3';
const web3 = new Web3(new providers.HttpProvider(process.env.INFURA_API_KEY));

import contractAbi from '../contracts/abi';
import contractAddress from '../contracts/contractAddress';

const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

const getTxRecord = async (idOnChain) => {
    const result = await contractInstance.methods.numberOfRecords().call();
    if (idOnChain < 0 || idOnChain >= result) {
        return Error('id out of range');
    }
    const txRecord = await contractInstance.methods['ehrs'](idOnChain).call();
    return txRecord;
};

const stringEncryptedKeyToBuffer = async (encryptedKey) => {
    let encryptedContent = JSON.parse(encryptedKey);
    encryptedContent = {
        iv: Buffer.from(encryptedContent.iv, 'hex'),
        ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
        mac: Buffer.from(encryptedContent.mac, 'hex'),
        ephemPublicKey: Buffer.from(encryptedContent.ephemPublicKey, 'hex'),
    };
    return encryptedContent;
};

const bufferEncryptedKeyToString = async (encryptedKey) => {
    // chuyen token thanh string de luu len blockchain
    const stringToken = JSON.stringify({
        iv: encryptedKey.iv.toString('hex'),
        ciphertext: encryptedKey.ciphertext.toString('hex'),
        mac: encryptedKey.mac.toString('hex'),
        ephemPublicKey: encryptedKey.ephemPublicKey.toString('hex'),
    });
    return stringToken;
};

const createRecordOnBlockchain = async (
    _token,
    _senderAddress,
    _targetAddress,
    _cid,
    _filename,
    _recordObject,
    _privateKey,
) => {
    // transaction data
    const owner = _targetAddress;
    const cid = _cid;
    const fileName = _filename;
    const encryptedKey = _token;
    // create the transaction object
    const txObject = {
        from: _senderAddress,
        to: contractAddress,
        gas: 3000000,
        data: contractInstance.methods
            .createEHR(owner, cid, fileName, encryptedKey)
            .encodeABI(),
    };
    // sign the transaction
    console.log('Signing tracsaction');
    web3.eth.accounts
        .signTransaction(txObject, _privateKey)
        .then((signedTx) => {
            // send the signed transaction to the network
            web3.eth
                .sendSignedTransaction(signedTx.rawTransaction)
                .on('receipt', (receipt) => {
                    console.log('Transaction receipt:', receipt);
                })
                .on('error', (error) => {
                    console.error('Error sending EHR:', error);
                });
        })
        .catch((error) => {
            console.error('Error signing transaction:', error);
        });
    contractInstance.methods
        .numberOfRecords()
        .call()
        .then(async (result) => {
            console.log('result:', result);
            _recordObject.idOnChain = result;
            _recordObject.save();
        })
        .catch((error) => {
            console.error(error);
        });
};

export default {
    getTxRecord,
    createRecordOnBlockchain,
    stringEncryptedKeyToBuffer,
    bufferEncryptedKeyToString,
    privateKeyB,
    publicKeyA,
    addressA: accountA.address,
    addressB: accountB.address,
};
