const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RelationshipRequest = new Schema(
    {
        senderId: { type: String, require: true },
        receiverId: { type: String, require: true },
        senderName: { type: String, default: '' },
        receiverName: { type: String, default: '' },
        senderRole: { type: String, require: true },
        receiverRole: { type: String, require: true },
        status: { type: String, default: 'Waitting' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('RelationshipRequest', RelationshipRequest);
