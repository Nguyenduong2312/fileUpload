const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Request = new Schema(
    {
        idSender: { type: String, require: true },
        idReceiver: { type: String, require: true },
        idRecord: { type: String, require: true },
        nameRecord: { type: String, require: true },
        idOnChain: { type: String, require: true },
        status: { type: String, default: 'Waiting' },
        id: { type: String, require: true },
        createdDate: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Request', Request);
