const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AcceptedRequest = new Schema(
    {
        idRequest: { type: String, require: true },
        idSender: { type: String, require: true },
        idReceiver: { type: String, require: true },
        typeRecord: { type: String, default: '' },
        listRecord: {type: Array, default: []},
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('AcceptedRequest', AcceptedRequest);
