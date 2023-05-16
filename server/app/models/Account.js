const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Account = new Schema(
    {
        id: { type: Number, required: true },
        name: { type: String, default: '' },
        gender: { type: String, default: '' },
        address: { type: String, default: '' },
        email: { type: String, default: '' },
        phoneNumber: { type: String, default: '' },
        birthday: { type: String},
        username: { type: String, required: true },
        password: { type: String, required: true },
        publicKey: { type: String, required: true },
        privateKey: { type: String, required: true },
        role: { type: String, required: true },
        relationship: { type: Object, default: {}},
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Account', Account);
