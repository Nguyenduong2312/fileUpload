const eccrypto = require('eccrypto');
const fs = require('fs');
const Record = require('../models/Record');

// setup web3 environment
require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_API_KEY),
);
const contractAbi = require('../contracts/abi');
const contractAddress = require('../contracts/contractAddress');
const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

// const ipfs = require('../ipfs/Ipfs')
// const node = ipfs.loadIpfs()

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

const UploadDrive = require('./UploadToDrive');
const DownloadDrive = require('./DownloadFromDrive');
const { drive } = require('googleapis/build/src/apis/drive');

//lưu file vào public/uploads
const path = `${process.cwd()}/server/public/uploads/`;

class UploadFileController {
    getRecord(req, res) {
        Record.find().then(function (record) {
            res.status(200).json(record);
        });
    }

    getRecordByReceiverId(req, res) {
        Record.find({ idReceiver: req.params.id }).then(function (record) {
            res.status(200).json(record);
        });
    }

    getRecordBySenderId(req, res) {
        Record.find({ idSender: req.params.id }).then(function (record) {
            res.status(200).json(record);
        });
    }

    upload(req, res) {
        console.log('uplaod');
        if (req.files === null) {
            return res.send('No file uploaded');
        } else if (req.body.id === '') {
            return res.send('Id can not be empty');
        }

        //uploadFile
        const file = req.files.file;

        file.mv(path + file.name, async (err) => {
            if (err) {
                console.log('lỗi');
                return res.status(500).send(err);
            }
            try {
                console.log('run');
                const data = fs.readFileSync(path + file.name);

                //generate khóa k và mã hóa nội dung tập tin
                const { key, en_data } = EncryptAES.encrypt(data);
                let googleFileId = null;
                try {
                    // file written successfully
                    fs.writeFileSync(path + file.name, en_data);
                    //up defile to drive
                    console.log(path + file.name, file.name);
                    const res = await UploadDrive.upload(
                        path + file.name,
                        file.name,
                    );
                    googleFileId = res.data.id;
                } catch (err) {
                    console.error(err);
                }
                //mã hóa k bằng ECC
                //1. Lấy public key từ id BN

                let record;
                const acc = await Account.findOne({ id: req.body.id }).then(
                    (account) => {
                        console.log('req body: ', req.body);
                        record = new Record();
                        record.idReceiver = req.body.id;
                        record.idSender = req.session.user.id;
                        record.fileName = file.name;
                        record.save().catch(() => res.json({ status: false }));
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
                const cid = googleFileId;
                const fileName = file.name;
                const encryptedKey = stringToken;

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
                contractInstance.methods
                    .numberOfRecords()
                    .call()
                    .then(async (result) => {
                        record.idOnChain = result;
                        record.save();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
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
                    id,
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

                let buffer = null;
                // // DownloadFromDrive.download(
                // //     txRecord.ehrLink,
                // //     txRecord.fileName,
                // // ).then((driveService) => {
                // //     let buf = [];
                // //     driveService.data.on('data', (e) => buf.push(e));
                // //     driveService.data.on('end', () => {
                // //         buffer = Buffer.concat(buf);
                // //         console.log(buffer);
                // //         res.status(200);
                // //     });
                // // });
                const driveService = await DownloadDrive.download(
                    txRecord.cid,
                    // txRecord.fileName,
                );
                let buf = [];
                driveService.data.on('data', (e) => buf.push(e));
                driveService.data.on('end', async () => {
                    buffer = Buffer.concat(buf);

                    const aesKey = await ECC.decrypt(
                        encryptedContent,
                        Buffer.from(privateKeyB, 'hex'),
                    );
                    console.log(aesKey);

                    const originalText = EncryptAES.decrypt(
                        buffer.toString(),
                        aesKey,
                    );
                    console.log(originalText);

                    // console.log("TEXT")
                    try {
                        // file written successfully
                        fs.writeFileSync(
                            path + 'de_' + txRecord.fileName,
                            originalText,
                        );
                        res.status(200).download(
                            path + 'de_' + txRecord.fileName,
                        );
                    } catch (err) {
                        console.error(err);
                        res.status(500);
                    }
                });
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
