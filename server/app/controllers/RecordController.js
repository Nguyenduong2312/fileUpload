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

const UploadDrive = require('../custom_modules/UploadToDrive');
const DownloadDrive = require('../custom_modules/DownloadFromDrive');
const { drive } = require('googleapis/build/src/apis/drive');

//lưu file vào public/uploads
const path = `${__dirname}/public/`;

class UploadFileController {
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
        } else if (req.files === null) {
            return res.send('No file uploaded!');
        }
        const file = req.files.file;
        //uploadFile
        file.mv(path + file.name, async (err) => {
            if (err) {
                return res.status(220).send(err);
            }
            try {
                const data = fs.readFileSync(path + file.name);
                const { key, en_data } = EncryptAES.encrypt(data);
                // let googleFileId = null;
                let ipfsCID;
                try {
                    // file written successfully
                    fs.writeFileSync(path + file.name, en_data);
                    //up defile to drive
                    // const res = await UploadDrive.upload(
                    //     path + file.name,
                    //     file.name,
                    // );
                    // googleFileId = res.data.id;
                    ipfsCID = await Ipfs.uploadFile(path + file.name);
                } catch (err) {
                    console.error(err);
                }

                //mã hóa k bằng ECC
                //1. Lấy public key từ id BN

                let record;
                record = new Record();
                record.idReceiver = req.body.id;
                record.idUploader = req.user.id;
                record.fileName = file.name;
                record.save().catch(() => {
                    res.status(400);
                });

                //console.log('keyB', publicKeyB);
                // console.log('string keyB', publicKeyB.toString('hex'));
                //2. Mã hóa khóa k
                const token = await ECC.encrypt(key, publicKeyB);
                // chuyen token thanh string de luu len blockchain
                const stringToken = JSON.stringify({
                    iv: token.iv.toString('hex'),
                    ciphertext: token.ciphertext.toString('hex'),
                    mac: token.mac.toString('hex'),
                    ephemPublicKey: token.ephemPublicKey.toString('hex'),
                });
                console.log('stringToken: ', stringToken);

                // transaction data
                const owner = accountB.address;
                const cid = ipfsCID;
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
                ///console.log('Signing tracsaction');
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
                            })
                            .then(() => {
                                fs.unlinkSync(path + file.name);
                                return res.status(200).send(`Uploaded!`);
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
