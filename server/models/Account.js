const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Account = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        birthday: { type: Date, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);
