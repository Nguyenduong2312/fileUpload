var cryptojs = require('crypto-js');
var crypto = require('crypto');

class EncryptAES {
    encrypt(data) {
        //generate khóa k
        const key = crypto.randomBytes(128).toString('hex');
        // encrypt data
        var wordArray = cryptojs.lib.WordArray.create(data); // Convert: ArrayBuffer -> WordArray
        var en_data = cryptojs.AES.encrypt(wordArray, key).toString();
        return { key, en_data };
    }
    convertWordArrayToUint8Array(wordArray) {
        var arrayOfWords = wordArray.hasOwnProperty('words')
            ? wordArray.words
            : [];
        var length = wordArray.hasOwnProperty('sigBytes')
            ? wordArray.sigBytes
            : arrayOfWords.length * 4;
        var uInt8Array = new Uint8Array(length),
            index = 0,
            word,
            i;
        for (i = 0; i < length; i++) {
            word = arrayOfWords[i];
            uInt8Array[index++] = word >> 24;
            uInt8Array[index++] = (word >> 16) & 0xff;
            uInt8Array[index++] = (word >> 8) & 0xff;
            uInt8Array[index++] = word & 0xff;
        }
        return uInt8Array;
    }
    decrypt(data, key) {
        //decrypt data
        var decrypted = cryptojs.AES.decrypt(data, key);
        var typedArray = this.convertWordArrayToUint8Array(decrypted); // Convert: WordArray -> typed array
        return typedArray;
    }
}

module.exports = new EncryptAES();
