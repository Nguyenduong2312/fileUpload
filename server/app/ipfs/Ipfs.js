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

    readDataFromIpfs = async (cid) => {
        let asyncitr = node.cat(cid);
        let content = '';
        for await (const itr of asyncitr) {
            let data = Buffer.from(itr).toString();
            content += data;
        }
        return content;
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

        let options = {
            warpWithDirectory: false,
            progress: (prog) => console.log(`Saved :${prog}`),
        };
        let result = await node.add(en_data, options);
        let cid = result.cid;
        return { cid, stringToken };
    };

    downloadFile = async (node, cid, destPath) => {
        let hashdata = node.cat(cid);
        const file = fs.createWriteStream(destPath);
        let content = '';
        for await (const itr of hashdata) {
            let data = Buffer.from(itr).toString();
            content += data;
        }
        file.write(content);
        return content;
    };
}
module.exports = new Ipfs();
