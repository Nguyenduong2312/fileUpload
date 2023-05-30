const Request = require('../models/Request');
const eccrypto = require('eccrypto');

const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_API_KEY),
);

const contractAbi = require('../contracts/abi');
const contractAddress = require('../contracts/contractAddress');
const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

const privateKeyA = process.env.PRIVATE_KEY_A;
const accountA = web3.eth.accounts.privateKeyToAccount(privateKeyA);
const publicKeyA = eccrypto.getPublic(Buffer.from(privateKeyA, 'hex'));

const privateKeyB = process.env.PRIVATE_KEY_B;
const accountB = web3.eth.accounts.privateKeyToAccount(privateKeyB);
const publicKeyB = eccrypto.getPublic(Buffer.from(privateKeyB, 'hex'));

class RequestController {
    getRequest(req, res) {
        Request.find().then(function (request) {
            res.status(200).json(request);
        });
    }
    getRequestByReceiverId(req, res) {
        Request.find({ idReceiver: req.params.id, status: 'Waitting' }).then(
            function (request) {
                res.status(200).json(request);
            },
        );
    }
    getRequestBySenderId(req, res) {
        Request.find({ idSender: req.params.id, status: 'Waitting' }).then(
            function (request) {
                res.status(200).json(request);
            },
        );
    }

    getAcceptedBySenderId(req, res) {
        Request.find({ idSender: req.params.id, status: 'Accepted' }).then(
            function (request) {
                res.status(200).json(request);
            },
        );
    }

    request(req, res) {
        const { idReceiver, idRecord, nameRecord, idOnChain } = req.body;
        Request.findOne({
            idSender: req.session.user.id,
            idReceiver: idReceiver,
            idRecord: idRecord,
            status: 'Waiting',
        }).then((request) => {
            if (request) {
                res.send(
                    'Request has already sent before. Waiting receiver accepted it.',
                );
            } else {
                const request = new Request();
                request.idReceiver = idReceiver;
                request.idSender = req.session.user.id;
                request.idRecord = idRecord;
                request.nameRecord = nameRecord;
                request.idOnChain = idOnChain;
                request
                    .save()
                    .then(() => res.send('Send request successful'))
                    .catch(() => res.send('Send request fail'));
            }
        });
    }
    updateRequest(req, res) {
        Request.findOne({ _id: req.params.id }).then((request) => {
            request.status = 'Accepted';
            request
                .save()
                .then(() =>
                    res.send(`Accepted request from ${req.body.idSender}`),
                )
                .catch(() => res.send(`Error!`));
        });
        //
    }
    deleteRequest(req, res) {
        Request.findOneAndRemove({ _id: req.params.id })
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }));
    }
}

module.exports = new RequestController();
