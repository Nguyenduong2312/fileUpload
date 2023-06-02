const Ipfs = require('../ipfs/Ipfs');
const path = require('path');
require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_API_KEY),
);
const contractAbi = require('../contracts/abi');
const contractAddress = require('../contracts/contractAddress');
const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
const eccrypto = require('eccrypto');

const ipfs = Ipfs.loadIpfs();
const privateKeyA = process.env.PRIVATE_KEY_A;
const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
const publicKeyA = eccrypto.getPublic(Buffer.from(privateKeyA, 'hex'));

const privateKeyB = process.env.PRIVATE_KEY_B;
const accountB = web3.eth.accounts.privateKeyToAccount(privateKeyB);
const publicKeyB = eccrypto.getPublic(Buffer.from(privateKeyB, 'hex'));
const Record = require('../models/Record');
const EncryptAES = require('./EncryptAES');
const ECC = require('./ECC');
const Account = require('../models/Account');

class IPFSController {
    // load(req, res, next)
    // {
    //     if (ipfs != null) {
    //         console.log(ipfs);
    //         res.status(200).json({ data: ipfs });
    //     }
    // }
    upFile(req, res) {
        ipfs.then(async (ipfs) => {
            try {
                const { cid, stringToken } = await Ipfs.uploadFile(
                    ipfs,
                    req.body.filePath,
                );

                // transaction data
                const owner = accountB.address;

                const fileName = path.basename(req.body.filePath);
                const encryptedKey = stringToken;

                let record;
                console.log('req body: ', req.body);
                record = new Record();
                record.idReceiver = req.body.id;
                record.idSender = req.session.user.id;
                record.fileName = fileName;
                console.log('record: ', record);
                record
                    .save()
                    .then(() => {
                        console.log('saved');
                    })
                    .catch(() => {
                        res.json({ status: false });
                    });
                // create the transaction object

                const txObject = {
                    from: accountA.address,
                    to: contractAddress,
                    gas: 3000000,
                    data: contractInstance.methods
                        .createEHR(
                            owner,
                            cid.toString(),
                            fileName,
                            encryptedKey,
                        )
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
                    });
                contractInstance.methods
                    .numberOfRecords()
                    .call()
                    .then(async (result) => {
                        console.log('result:', result);
                        record.idOnChain = result;
                        record.save();
                        console.log(record);
                    });
                res.status(200).json({ data: txObject });
            } catch (error) {
                console.error('Error uploading file:', error);
                res.status(500).json({ error: 'Failed to upload file' });
            }
        });
    }
    downFile(req, res) {
        ipfs.then(async (ipfs) => {
            try {
                const { id } = req.params;
                contractInstance.methods
                    .numberOfRecords()
                    .call()
                    .then(async (result) => {
                        if (id < 0 || id >= result) {
                            return res
                                .status(404)
                                .json({ msg: 'id out of range' });
                        }
                        const txRecord = await contractInstance.methods['ehrs'](
                            id,
                        ).call();
                        console.log('DECRYPTING');

                        //decrypt
                        // chuyen string thanh buffer
                        let encryptedContent = JSON.parse(
                            txRecord.encryptedKey,
                        );
                        encryptedContent = {
                            iv: Buffer.from(encryptedContent.iv, 'hex'),
                            ciphertext: Buffer.from(
                                encryptedContent.ciphertext,
                                'hex',
                            ),
                            mac: Buffer.from(encryptedContent.mac, 'hex'),
                            ephemPublicKey: Buffer.from(
                                encryptedContent.ephemPublicKey,
                                'hex',
                            ),
                        };

                        let data = await Ipfs.downloadFile(
                            ipfs,
                            txRecord.cid,
                            txRecord.fileName,
                            encryptedContent,
                        );

                        res.status(200).json({ status: true });
                    });
            } catch (error) {
                console.error('Error downloading file:', error);
                res.status(500).json({ error: 'Failed to download file' });
            }
        });
    }
}

module.exports = new IPFSController();
