const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Record = new Schema(
    {
        idSender: { type: String, require: true },
        idReceiver: { type: String, require: true },
        fileName: { type: String, default: '' },
        typeRecord: { type: String, default: '' },
        createdDate: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Record', Record);
