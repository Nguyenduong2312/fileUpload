const fs = require('fs');

const Record = require('../models/Record');

// setup web3 environment
require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_API_KEY),
);

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

        const record = new Record();
        record.idReceiver = req.body.id;
        record.idUploader = req.user.id;
        record.fileName = req.body.filename;
        record.idOnChain = req.body.idOnChain;
        record.save().catch(() => {
            res.status(400);
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
