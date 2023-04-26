const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Request = new Schema(
    {
        idSender: { type: String, require: true },
        idReceiver: { type: String, require: true },
        typeRecord: { type: String, default: '' },
        status: { type: String, default: 'Waitting' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Request', Request);
