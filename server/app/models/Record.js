const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Record = new Schema(
    {
        _idBN: { type: String, default: ''  },
        _idBS: { type: String, default: '' },
        name: { type: String, default: '' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Record', Record);
