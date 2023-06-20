const eccrypto = require('eccrypto');
const fs = require('fs');

const Record = require('../models/Record');
const Ipfs = require('../ipfs/Ipfs');

// setup web3 environment
require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_API_KEY),
);
const contractAbi = require('../contracts/abi');
const contractAddress = require('../contracts/contractAddress');
const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

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

const EncryptAES = require('../custom_modules/EncryptAES');
const ECC = require('../custom_modules/ECC');

//lưu file vào public/uploads
const path = `${__dirname}/public/`;

class UploadFileController {
    getRecordDetailById(req, res) {
        Record.findById({ _id: req.params.id }).then((record) => {
            res.send(record);
        });
    }

    getRecordById(req, res) {
        Record.find({ idReceiver: req.params.id, idSender: '' }).then(
            (record) => {
                res.status(200).json(record);
            },
        );
    }

    getReceivedRecordById(req, res) {
        Record.find({ idReceiver: req.params.id, idUploader: '' }).then(
            (record) => {
                res.status(200).json(record);
            },
        );
    }

    upload(req, res) {
        if (req.body.id === '') {
            return res.send('Id can not be empty!');
        }
        // else if (req.files === null) {
        //     return res.send('No file uploaded!');
        // }
        const record = new Record();
        record.idReceiver = req.body.id;
        record.idUploader = req.user.id;
        record.fileName = req.body.filename;
        record.idOnChain = req.body.idOnChain;
        record.save().catch(() => {
            res.status(400);
        });
        //uploadFile
    }

    downloadRecord(req, res) {
        const { id } = req.params;
        contractInstance.methods
            .numberOfRecords()
            .call()
            .then(async (result) => {
                const record = await Record.findById(id);
                if (record.idOnChain < 0 || record.idOnChain >= result) {
                    return res.status(404).send('id out of range');
                }
                const txRecord = await contractInstance.methods['ehrs'](
                    record.idOnChain,
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
                console.log('res1');
                Ipfs.downloadFile(
                    txRecord.cid,
                    path + 'de_' + txRecord.fileName,
                    encryptedContent,
                ).then(() => {
                    console.log('res');
                    res.status(200).download(path + 'de_' + txRecord.fileName);
                    //fs.unlinkSync(path + 'de_' + txRecord.fileName);
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }
    deleteRecord(req, res) {
        Record.findOneAndRemove({ _id: req.params.id })
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }));
    }
    deleteFile(req, res) {
        try {
            fs.unlinkSync(path + 'de_' + req.body.filename);
            return res.status(200).send('xóa thành công');
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = new UploadFileController();
