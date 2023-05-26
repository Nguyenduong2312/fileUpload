const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Request = new Schema(
    {
        idSender: { type: String, require: true },
        idReceiver: { type: String, require: true },
        typeRecord: { type: String, default: '' },
        status: { type: String, default: 'Waiting' },
        id: { type: String, require: true },
        createdDate: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Request', Request);
