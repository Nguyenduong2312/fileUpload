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

// test if imported key is working
const privateKeyA = process.env.PRIVATE_KEY_A;
const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
const publicKeyA = eccrypto.getPublic(Buffer.from(privateKeyA, 'hex'));

const privateKeyB = process.env.PRIVATE_KEY_B;
const accountB = web3.eth.accounts.privateKeyToAccount(privateKeyB);
const publicKeyB = eccrypto.getPublic(Buffer.from(privateKeyB, 'hex'));

// Blockchain key length
// private key: dd9f05bb8788eb238be1f0d5dfe0bc8102536810babb78962a595abb33de4ba5 (64 hex charaters, 256 bit-value)
// public key: 0xf5742F47DeB2943D550A65C95Bfa4fA6957B59b5 (64 hex characters, 512-bit (64 byte-value))

// In Ethereum, public and private keys are generated using the Elliptic Curve Digital Signature Algorithm (ECDSA) with the secp256k1 curve.
// A private key in Ethereum is a 256-bit integer, which can be represented as a hexadecimal string of 64 characters.
// A public key in Ethereum is a 512-bit (64-byte) value derived from the private key through a mathematical process. It is represented as a hexadecimal string of 128 characters, where the first 64 characters represent the x-coordinate of the public key, and the remaining 64 characters represent the y-coordinate.
// When a public key is hashed using the Keccak-256 algorithm (also known as SHA-3), it produces a 256-bit (32-byte) value known as the Ethereum address. The Ethereum address is represented as a hexadecimal string of 40 characters.

const EncryptAES = require('./EncryptAES');
const ECC = require('./ECC');
const convertString = require('./convertString');
const Account = require('../models/Account');

class DownloadRecordController {
    download(req, res) {
        res.json({ status: true });
    }
}

module.exports = new DownloadRecordController();
