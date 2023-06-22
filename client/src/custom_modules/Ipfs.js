import { encrypt as encryptAES, decrypt as decryptAES } from './EncryptAES';
import { encrypt as encryptECC, decrypt as decryptECC } from './ECC';
import { getFilesFromPath, Web3Storage, File } from 'web3.storage';
import Web3 from 'web3';
import contractAbi from '../contracts/abi';
import { contractAddress } from '../contracts/contractAddress';
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_API_KEY),
);
const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

require('dotenv').config();

// const privateKeyB = process.env.REACT_APP_PRIVATE_KEY_B;
// const accountB = web3.eth.accounts.privateKeyToAccount(privateKeyB);
// const publicKeyB = eccrypto.getPublic(Buffer.from(privateKeyB, 'hex'));

const getAccessToken = () => {
    return process.env.REACT_APP_WEB3STORAGE_TOKEN;
};

const makeStorageClient = () => {
    return new Web3Storage({ token: getAccessToken() });
};

const getFiles = async (path) => {
    const files = await getFilesFromPath(path);
    return files;
};

const storeFiles = async (filename) => {
    const client = makeStorageClient();
    const cid = await client.put(filename);
    console.log('stored files with cid:', cid);
    return cid;
};

const retrieveFiles = async (cid) => {
    const client = makeStorageClient();
    const res = await client.get(cid);

    // unpack File objects from the response
    const files = await res.files();

    for (const file of files) {
        const fileData = (await file.text()).toString();
        return fileData;
    }
};

export const uploadFile = async (arrayBuffer, filename, publicKey) => {
    const { key, en_data } = encryptAES(arrayBuffer);
    const blob = new Blob([en_data], { type: 'mimeType' });
    const files = [new File([blob], filename)];
    const cid = await storeFiles(files);
    const token = await encryptECC(key, publicKey);
    const stringToken = JSON.stringify({
        iv: token.iv.toString('hex'),
        ciphertext: token.ciphertext.toString('hex'),
        mac: token.mac.toString('hex'),
        ephemPublicKey: token.ephemPublicKey.toString('hex'),
    });
    return { cid, stringToken };
};

export const downloadFile = async (
    cid,
    filename,
    encryptedContent,
    privateKey,
) => {
    let hashdata;
    let originalText;
    console.log(cid);
    try {
        hashdata = await retrieveFiles(cid);
        let key = JSON.parse(encryptedContent);
        key = {
            iv: Buffer.from(key.iv, 'hex'),
            ciphertext: Buffer.from(key.ciphertext, 'hex'),
            mac: Buffer.from(key.mac, 'hex'),
            ephemPublicKey: Buffer.from(key.ephemPublicKey, 'hex'),
        };
        console.log(key);
        const aesKey = await decryptECC(key, Buffer.from(privateKey, 'hex'));
        originalText = decryptAES(hashdata.toString(), aesKey);
    } catch (err) {
        console.log(err);
    }

    try {
        // file written successfully
        const blob = new Blob([originalText], { type: 'mimeType' });
        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = filename;
        alink.click();
    } catch (err) {
        console.error(err);
    }
    return originalText;
};
