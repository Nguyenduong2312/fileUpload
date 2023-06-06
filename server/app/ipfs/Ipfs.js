const fs = require('fs');
const path = require('path');
const EncryptAES = require('../controllers/EncryptAES');
const eccrypto = require('eccrypto');
const ECC = require('../controllers/ECC');
const { getFilesFromPath, File, Web3Storage } = require('web3.storage');
require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_API_KEY),
);

const privateKeyB = process.env.PRIVATE_KEY_B;
const accountB = web3.eth.accounts.privateKeyToAccount(privateKeyB);
const publicKeyB = eccrypto.getPublic(Buffer.from(privateKeyB, 'hex'));

class Ipfs {
    getAccessToken() {
        return process.env.WEB3STORAGE_TOKEN;
    }

    makeStorageClient() {
        return new Web3Storage({ token: this.getAccessToken() });
    }
    getFiles = async (path) => {
        const files = await getFilesFromPath(path);
        return files;
    };

    storeFiles = async (filename) => {
        const client = await this.makeStorageClient();
        const cid = await client.put(filename);
        console.log('stored files with cid:', cid);
        return cid;
    };

    uploadFile = async (filePath) => {
        let data = fs.readFileSync(filePath);
        const { key, en_data } = EncryptAES.encrypt(data);

        const file = await this.getFiles(filePath);
        const cid = await this.storeFiles(file);
        //2. Mã hóa khóa k
        const token = await ECC.encrypt(key, publicKeyB);
        const stringToken = JSON.stringify({
            iv: token.iv.toString('hex'),
            ciphertext: token.ciphertext.toString('hex'),
            mac: token.mac.toString('hex'),
            ephemPublicKey: token.ephemPublicKey.toString('hex'),
        });

        console.log('File uploaded successfully. CID:', cid);
        return { cid, stringToken };
    };
}

downloadFile = async (node, cid, destPath, encryptedContent) => {
    let hashdata = await this.readDataFromIpfs(node, cid);
    const file = fs.createWriteStream(destPath);
    const aesKey = await ECC.decrypt(
        encryptedContent,
        Buffer.from(privateKeyB, 'hex'),
    );

    const originalText = EncryptAES.decrypt(hashdata.toString(), aesKey);
    //console.log(originalText.toString())
    // const plainttext = String.fromCharCode.apply(null, originalText);
    // console.log(plainttext) // convert Uint8Array to string
    file.write(originalText);
    return originalText;
};

module.exports = new Ipfs();
