const eccrypto = require('eccrypto');
const fs = require('fs');
const Record = require('../models/Record');

// setup web3 environment
require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_API_KEY),
);
const contractAbi = require('../../contracts/abi');
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

// setup ipfs node
const { loadIpfs, saveFileToIpfs, getDataFromIpfs } = require('./IpfsHandler');
// const node = loadIpfs()

// const privateKeyA = eccrypto.generatePrivate();
// const publicKeyA = eccrypto.getPublic(privateKeyA);
// const privateKeyB = eccrypto.generatePrivate();
// const publicKeyB = eccrypto.getPublic(privateKeyB);

const privateKeyA = process.env.PRIVATE_KEY_A;
const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
const publicKeyA = eccrypto.getPublic(Buffer.from(privateKeyA, 'hex'));

const privateKeyB = process.env.PRIVATE_KEY_B;
const accountB = web3.eth.accounts.privateKeyToAccount(privateKeyB);
const publicKeyB = eccrypto.getPublic(Buffer.from(privateKeyB, 'hex'));

// Blockchain key length
// private key: dd9f05bb8788eb238be1f0d5dfe0bc8102536810babb78962a595abb33de4ba5 (64 hex charaters, 256 bit-value)
// public key: 0xf5742F47DeB2943D550A65C95Bfa4fA6957B59b5 (64 hex characters, 512-bit (64 byte-value))

const EncryptAES = require('./EncryptAES');
const ECC = require('./ECC');
const Account = require('../models/Account');

//lưu file vào public/uploads
const path = `${process.cwd()}/server/public/uploads/`;

class UploadFileController {
    getRecord(req, res) {
        Record.find().then(function (rc) {
            res.status(200).json(rc);
        });
    }

    upload(req, res) {
        if (req.files === null) {
            console.log('lỗi');
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        //uploadFile
        const file = req.files.file;

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
                const acc = await Account.findOne({ username: idBN }).then(
                    function (acc) {
                        const record = new Record();
                        record._idBN = idBN;
                        record._idbs = '142'; //get userId
                        record.name = file.name;
                        record.save();
                        //.then(() => res.json({ status: true }))
                        //.catch(() => res.json({ status: false }));
                    },
                );
                console.log('pk', acc);
                console.log('keyB', publicKeyB);
                console.log('string keyB', publicKeyB.toString('hex'));

                //2. Mã hóa khóa k
                const token = await ECC.encrypt(key, publicKeyB);

                // chuyen token thanh string de luu len blockchain
                const stringToken = JSON.stringify({
                    iv: token.iv.toString('hex'),
                    ciphertext: token.ciphertext.toString('hex'),
                    mac: token.mac.toString('hex'),
                    ephemPublicKey: token.ephemPublicKey.toString('hex'),
                });

                // transaction data
                const owner = accountB.address;
                const ehrLink = file.name;
                const encryptedKey = stringToken;

                // create the transaction object
                const txObject = {
                    from: accountA.address,
                    to: contractAddress,
                    gas: 3000000,
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

                // // chuyen string thanh buffer
                // let encryptedContent = JSON.parse(stringToken);
                // encryptedContent = {
                //         iv: Buffer.from(encryptedContent.iv, 'hex'),
                //         ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
                //         mac: Buffer.from(encryptedContent.mac, 'hex'),
                //         ephemPublicKey: Buffer.from(encryptedContent.ephemPublicKey, 'hex')
                //     }

                // const aesKey = await ECC.decrypt(encryptedContent, Buffer.from(privateKeyB,"hex"));
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

        res.status(200).json({ status: true });
    }

    downloadRecord(req, res) {
        const { id } = req.params;

        contractInstance.methods
            .numberOfRecords()
            .call()
            .then(async (result) => {
                if (id < 0 || id >= result) {
                    return res.status(404).json({ msg: 'id out of range' });
                }
                const txRecord = await contractInstance.methods['ehrs'](
                    result - 1,
                ).call();
                console.log('DECRYPTING');

                //decrypt

                // chuyen string thanh buffer
                let encryptedContent = JSON.parse(txRecord.encryptedKey);
                encryptedContent = {
                    iv: Buffer.from(encryptedContent.iv, 'hex'),
                    ciphertext: Buffer.from(encryptedContent.ciphertext, 'hex'),
                    mac: Buffer.from(encryptedContent.mac, 'hex'),
                    ephemPublicKey: Buffer.from(
                        encryptedContent.ephemPublicKey,
                        'hex',
                    ),
                };

                const en_data = fs.readFileSync(path + txRecord.ehrLink);
                console.log(en_data);

                const aesKey = await ECC.decrypt(
                    encryptedContent,
                    Buffer.from(privateKeyB, 'hex'),
                );
                console.log(aesKey);

                const originalText = EncryptAES.decrypt(
                    en_data.toString(),
                    aesKey,
                );
                console.log(originalText);

                // console.log("TEXT")
                try {
                    // file written successfully
                    fs.writeFileSync(
                        path + 'de_' + txRecord.ehrLink,
                        originalText,
                    );
                    res.status(200).json({ status: true });
                } catch (err) {
                    console.error(err);
                    res.status(500);
                }
            })
            .catch((error) => {
                console.error(error);
            });

        // Record.findById(id)
        //     .then(record => {
        //         if (!record) {
        //             return res.status(404).send('Record not found');
        //         }
        //         console.log(record);
        //         const file = record.name;
        //         const path = `${process.cwd()}/server/public/uploads/`;
        //         const filePath = path + file;
        //         res.status(200).download(filePath);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         res.status(500).send('Server error');
        //     });
    }
}

module.exports = new UploadFileController();
