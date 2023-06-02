const fs = require('fs');
const EncryptAES = require('../controllers/EncryptAES');
const eccrypto = require('eccrypto');
const ECC = require('../controllers/ECC');

require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_API_KEY),
);

const privateKeyB = process.env.PRIVATE_KEY_B;
const accountB = web3.eth.accounts.privateKeyToAccount(privateKeyB);
const publicKeyB = eccrypto.getPublic(Buffer.from(privateKeyB, 'hex'));

class Ipfs {
    loadIpfs = async () => {
        const { create } = await import('ipfs-http-client');
        // connect to a different API
        const client = create({ url: 'http://127.0.0.1:5002/api/v0' });
        return client;
    };

    saveDataToIpfs = async (node, data) => {
        const fileAdded = await node.add({
            content: data,
        });

        return fileAdded.cid;
    };

    readDataFromIpfs = async (node, cid) => {
        const chunks = [];
        for await (const chunk of node.cat(cid)) {
            chunks.push(chunk);
        }
        const hashdata = Buffer.concat(chunks);
        return hashdata;
    };

    uploadFile = async (node, filePath) => {
        let data = fs.readFileSync(filePath);
        const { key, en_data } = EncryptAES.encrypt(data);

        //2. Mã hóa khóa k
        const token = await ECC.encrypt(key, publicKeyB);
        // chuyen token thanh string de luu len blockchain
        const stringToken = JSON.stringify({
            iv: token.iv.toString('hex'),
            ciphertext: token.ciphertext.toString('hex'),
            mac: token.mac.toString('hex'),
            ephemPublicKey: token.ephemPublicKey.toString('hex'),
        });

        let result = await node.add(en_data);
        let cid = result.cid;
        return { cid, stringToken };
    };

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
}
module.exports = new Ipfs();
