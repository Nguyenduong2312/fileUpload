const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RelationshipRequest = new Schema(
    {
        idSender: { type: String, require: true },
        idReceiver: { type: String, require: true },
        senderRole: { type: String, require: true },
        receiverRole: { type: String, require: true },
        status: { type: String, default: 'Waitting' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('RelationshipRequest', RelationshipRequest);
