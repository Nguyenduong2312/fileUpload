import Web3, { providers } from 'web3';

import contractAbi from '../contracts/abi';
import { contractAddress } from '../contracts/contractAddress';
import { encrypt as encryptECC, decrypt as decryptECC } from './ECC';

const web3 = new Web3(
    new providers.HttpProvider(process.env.REACT_APP_INFURA_API_KEY),
);

const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

export const getTxRecord = async (idOnChain) => {
    const result = await contractInstance.methods.numberOfRecords().call();
    if (idOnChain < 0 || idOnChain >= result) {
        return Error('id out of range');
    }
    const txRecord = await contractInstance.methods['ehrs'](idOnChain).call();
    return txRecord;
};

const stringEncryptedKeyToBuffer = (encryptedKey) => {
    let encryptedContent = JSON.parse(encryptedKey);
    encryptedContent = {
        iv: Buffer.from(encryptedContent.iv, 'hex'),
        ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
        mac: Buffer.from(encryptedContent.mac, 'hex'),
        ephemPublicKey: Buffer.from(encryptedContent.ephemPublicKey, 'hex'),
    };
    return encryptedContent;
};

const bufferEncryptedKeyToString = (encryptedKey) => {
    // chuyen token thanh string de luu len blockchain
    const stringToken = JSON.stringify({
        iv: encryptedKey.iv.toString('hex'),
        ciphertext: encryptedKey.ciphertext.toString('hex'),
        mac: encryptedKey.mac.toString('hex'),
        ephemPublicKey: encryptedKey.ephemPublicKey.toString('hex'),
    });
    return stringToken;
};
export const createRecordOnBlockchain = async (
    _token,
    _targetAddress,
    _cid,
    _filename,
    _privateKey,
) => {
    console.log(_cid);
    const accountA = web3.eth.accounts.privateKeyToAccount(_privateKey);
    // transaction data
    const owner = _targetAddress;
    const cid = _cid;
    const fileName = _filename;
    const encryptedKey = _token;
    // create the transaction object
    const txObject = {
        from: accountA.address,
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
    const idOnChain = await contractInstance.methods.numberOfRecords().call();
    return idOnChain;
};

export const getAddress = (privateKey) => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    return account.address;
};

export const reEncryptAESKey = async (
    encryptedKey,
    privateKeyB,
    publicKeyA,
) => {
    // Get buffer encrypted AES key
    const token = stringEncryptedKeyToBuffer(encryptedKey);

    // Decrypt AES key with patient private key
    const aesKey = await decryptECC(token, Buffer.from(privateKeyB, 'hex'));
    // Encrypt AES key
    const encryptedAESKey = await encryptECC(aesKey, publicKeyA);

    const stringToken = bufferEncryptedKeyToString(encryptedAESKey);
    return stringToken;
};
