const Request = require('../models/Request');
const Record = require('../models/Record');
const ECC = require('../custom_modules/ECC');
const {
    stringEncryptedKeyToBuffer,
    getTxRecord,
    createRecordOnBlockchain,
    bufferEncryptedKeyToString,
    privateKeyB,
    publicKeyA,
    addressA,
    addressB,
} = require('../custom_modules/contractModules');

class RequestController {
    getRequest(req, res) {
        Request.find().then(function (request) {
            res.status(200).json(request);
        });
    }
    getRequestByReceiverId(req, res) {
        Request.find({ idReceiver: req.params.id, status: 'Waiting' }).then(
            function (request) {
                res.status(200).json(request);
            },
        );
    }
    getRequestBySenderId(req, res) {
        Request.find({ idSender: req.params.id }).then(function (request) {
            res.status(200).json(request);
        });
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
            idSender: req.user.id,
            idReceiver: idReceiver,
            idRecord: idRecord,
            status: 'Waiting',
        }).then((request) => {
            if (request) {
                res.send(
                    'Request has already been sent before. Waiting for receiver to accept it.',
                );
            } else {
                const request = new Request();
                request.idReceiver = idReceiver;
                request.idSender = req.user.id;
                request.idRecord = idRecord;
                request.nameRecord = nameRecord;
                request.idOnChain = idOnChain;
                request
                    .save()
                    .then(() => res.send('Request sent successfully.'))
                    .catch(() => res.send('Request sent fail.'));
            }
        });
    }
    updateRequest(req, res) {
        console.log('update');
        Request.findOne({ _id: req.params.id }).then((request) => {
            request.status = req.body.status;
            request
                .save()
                .then(() =>
                    res.send(`Accepted request from ${req.body.idSender}`),
                )
                .catch(() => res.send(`Error!`));

            if (req.body.status === 'Accepted') {
                Record.findById(request.idRecord).then(async (record) => {
                    const copyRecord = await Record.create({
                        idReceiver: request.idSender,
                        idSender: request.idReceiver,
                        fileName: record.fileName,
                    });

                    // Get record on blockchain
                    console.log('record.idOnChain: ', record.idOnChain);
                    const txRecord = await getTxRecord(record.idOnChain);

                    // Get buffer encrypted AES key
                    const token = await stringEncryptedKeyToBuffer(
                        txRecord.encryptedKey,
                    );

                    // Decrypt AES key with patient private key
                    const aesKey = await ECC.decrypt(
                        token,
                        Buffer.from(privateKeyB, 'hex'),
                    );
                    // Encrypt AES key
                    const encryptedAESKey = await ECC.encrypt(
                        aesKey,
                        publicKeyA,
                    );
                    console.log('encryptedAESKey', encryptedAESKey);
                    // Conver AES key from buffer to string
                    const stringToken = await bufferEncryptedKeyToString(
                        encryptedAESKey,
                    );

                    //console.log('stringToken: ',stringToken);
                    //console.log('addressA', addressA);
                    await createRecordOnBlockchain(
                        stringToken,
                        addressB,
                        addressA,
                        txRecord.cid,
                        txRecord.fileName,
                        copyRecord,
                        privateKeyB,
                    ).then(() => {
                        console.log('done');
                    });

                    // res.json({ status: true })
                });
            }
        });
        //
    }
    deleteRequest(req, res) {
        console.log('delete', req.params.id);
        Request.findOneAndRemove({ _id: req.params.id })
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }));
    }
}

module.exports = new RequestController();
