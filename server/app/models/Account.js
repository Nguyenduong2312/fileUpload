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
        birthday: { type: String, default: '1990-01-01' },
        username: { type: String, required: true },
        password: { type: String, required: true },
        publicKey: { type: String, required: true },
        privateKey: { type: String, required: true },
        role: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Account', Account);
