var cryptojs = require('crypto-js');
var crypto = require('crypto');

class EncryptAES {
    encrypt(data) {
        //generate khóa k
        const key = crypto.randomBytes(128).toString('hex');
        // encypt data
        var en_data = cryptojs.AES.encrypt(data, key).toString();
        return { key, en_data };
    }
    decrypt(data, key) {
        //decrypt data
        console.log(typeof data);
        var bytes = cryptojs.AES.decrypt(data, key);
        var originalText = bytes.toString(cryptojs.enc.Utf8);
        return originalText;
    }
}

module.exports = new EncryptAES();
