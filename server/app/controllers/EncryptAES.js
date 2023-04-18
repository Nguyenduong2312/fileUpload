var cryptojs = require('crypto-js');
var crypto = require('crypto');

class EncyptAES {
    AES(data){
        //generate khóa k 
        const key = crypto.randomBytes(20).toString('hex');
        // encypt data
        var en_data = cryptojs.AES.encrypt(data, key).toString();
        return {key, en_data};
    }
}

module.exports = new EncyptAES();
