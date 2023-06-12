import { writeFileSync, readFileSync } from 'fs';
import { decrypt } from '../custom_modules/EncryptAES';
import { decrypt as _decrypt } from '../custom_modules/ECC';
import { getFilesFromPath, Web3Storage } from 'web3.storage';
require('dotenv').config();
import Web3, { providers } from 'web3';
const web3 = new Web3(new providers.HttpProvider(process.env.INFURA_API_KEY));

const getAccessToken = () => {
    return process.env.WEB3STORAGE_TOKEN;
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

export const uploadFile = async (filePath) => {
    let data = readFileSync(filePath);
    const { key, en_data } = EncryptAES.encrypt(data);
    // overwrite encrypt data to file
    writeFileSync(filePath, en_data);
    const file = await getFiles(filePath);
    const cid = await storeFiles(file);
    //2. Mã hóa khóa k
    const token = await ECC.encrypt(key, publicKeyB);
    const stringToken = JSON.stringify({
        iv: token.iv.toString('hex'),
        ciphertext: token.ciphertext.toString('hex'),
        mac: token.mac.toString('hex'),
        ephemPublicKey: token.ephemPublicKey.toString('hex'),
    });

    console.log('File uploaded successfully. CID:', cid);
    return cid, stringToken;
};

export const downloadFile = async (cid, destPath, encryptedContent, priKey) => {
    let hashdata = await retrieveFiles(cid);
    const aesKey = await _decrypt(encryptedContent, Buffer.from(priKey, 'hex'));

    const originalText = decrypt(hashdata.toString(), aesKey);
    console.log(originalText);
    try {
        // file written successfully
        writeFileSync(destPath, originalText);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
    return originalText;
};
