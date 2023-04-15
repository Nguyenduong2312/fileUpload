const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Account = new Schema(
    {
        name: { type: String, default: '' },
        address: { type: String, default: '' },
        email: { type: String, required: true },
        phoneNumber: { type: String, default: '' },
        birthday: { type: Date },
        password: { type: String, required: true },
        role: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);
