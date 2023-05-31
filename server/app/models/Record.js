const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Record = new Schema(
    {
        idUploader: { type: String, default: '' },
        idSender: { type: String, default: '' },
        idReceiver: { type: String, require: true },
        fileName: { type: String, default: '' },
        typeRecord: { type: String, default: '' },
        createdDate: { type: Date, default: Date.now },
        idOnChain: { type: String, default: '' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Record', Record);
