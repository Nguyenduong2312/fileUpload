const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Account = new Schema(
    {
        _id: { type: Number },
        name: { type: String, default: '' },
        address: { type: String, default: '' },
        email: { type: String, default: '' },
        phoneNumber: { type: String, default: '' },
        birthday: { type: Date },
        username: { type: String, required: true },
        password: { type: String, required: true },
        publicKey: { type: String, required: true },
        privateKey: { type: String, required: true },
        role: { type: String, required: true },
    },
    {
        _id: false,
        timestamps: true,
    },
);

module.exports = mongoose.model('Account', Account);
