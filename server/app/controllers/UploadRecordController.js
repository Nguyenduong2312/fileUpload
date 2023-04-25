// set up web3 environment
require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_API_KEY),
);
const contractAbi = require('../../contracts/abi');
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

const eccrypto = require('eccrypto');
const fs = require('fs');
const convertString = require('./convertString');
const Record = require('../models/Record');


// const privateKeyA = eccrypto.generatePrivate();
// const publicKeyA = eccrypto.getPublic(privateKeyA);
// const privateKeyB = eccrypto.generatePrivate();
// const publicKeyB = eccrypto.getPublic(privateKeyB);

// test if imported key is working
const privateKeyA = process.env.PRIVATE_KEY_A;
const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
const publicKeyA = eccrypto.getPublic(Buffer.from(privateKeyA, 'hex'));

const privateKeyB = process.env.PRIVATE_KEY_B;
const accountB = web3.eth.accounts.privateKeyToAccount(privateKeyB);
const publicKeyB = eccrypto.getPublic(Buffer.from(privateKeyB, 'hex'));

// test if generated key is working
// tested and worked

// Blockchain key length
// private key: dd9f05bb8788eb238be1f0d5dfe0bc8102536810babb78962a595abb33de4ba5 (64 hex charaters, 256 bit-value)
// public key: 0xf5742F47DeB2943D550A65C95Bfa4fA6957B59b5 (64 hex characters, 512-bit (64 byte-value))

// In Ethereum, public and private keys are generated using the Elliptic Curve Digital Signature Algorithm (ECDSA) with the secp256k1 curve.
// A private key in Ethereum is a 256-bit integer, which can be represented as a hexadecimal string of 64 characters.
// A public key in Ethereum is a 512-bit (64-byte) value derived from the private key through a mathematical process. It is represented as a hexadecimal string of 128 characters, where the first 64 characters represent the x-coordinate of the public key, and the remaining 64 characters represent the y-coordinate.
// When a public key is hashed using the Keccak-256 algorithm (also known as SHA-3), it produces a 256-bit (32-byte) value known as the Ethereum address. The Ethereum address is represented as a hexadecimal string of 40 characters.

const EncryptAES = require('./EncryptAES');
const ECC = require('./ECC');
const Account = require('../models/Account');

class UploadFileController {
    getRecord(req,res) {
        Record.find().then(function(rc){
            res.status(200).json(rc)
        })
    }

    
    upload(req, res) {
        if (req.files === null) {
            console.log('lỗi');
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        //uploadFile
        const file = req.files.file;

        //lưu file vào public/uploads
        const path = `${process.cwd()}/server/public/uploads/`;

        file.mv(path + file.name, async (err) => {
            if (err) {
                console.error(err);
               // return res.status(500).send(err);
            }
            try {
                const data = fs.readFileSync(path + file.name);

                //generate khóa k và mã hóa nội dung tập tin
                const { key, en_data } = EncryptAES.encrypt(data);

                try {
                    // file written successfully
                    fs.writeFileSync(path + file.name, en_data);
                } catch (err) {
                    console.error(err);
                }
                //mã hóa k bằng ECC
                //1. Lấy public key từ id BN

                const idBN = req.body.name;
                const acc = await Account.findOne({ id: idBN })
                .then(function(acc) {
                    const record = new Record();
                    record._idBN = idBN
                    record._idbs = "142" //get userId
                    record.name = file.name
                    record
                        .save()
                        //.then(() => res.json({ status: true }))
                        .catch(() => res.json({ status: false }));
                })
                console.log('pk', acc);
                console.log('keyB', publicKeyB);

                //2. Mã hóa khóa k
                const token = await ECC.encrypt(key, publicKeyB);
                // transaction data
                const owner = accountB.address;
                const ehrLink = file.name;
                const encryptedKey = token;

                // create the transaction object
                const txObject = {
                    from: accountA.address,
                    to: contractAddress,
                    gas: 200000,
                    data: contractInstance.methods
                        .createEHR(owner, ehrLink, encryptedKey)
                        .encodeABI(),
                };

                // sign the transaction
                console.log('Signing tracsaction');
                web3.eth.accounts
                    .signTransaction(txObject, accountA.privateKey)
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

                // console.log('DECRYPTING');

                // //decrypt
                // const aesKey = await ECC.decrypt(token, Buffer.from(privateKeyB,"hex"));
                // const originalText = EncryptAES.decrypt(en_data, aesKey);
                // // console.log("TEXT")
                // try {
                //     // file written successfully
                //     fs.writeFileSync(path + 'de_' + file.name, originalText);
                // } catch (err) {
                //     console.error(err);
                // }
            } catch (err) {
                console.error(err);
            }
        });

        res.json({ status: true });
    }
}

module.exports = new UploadFileController();
