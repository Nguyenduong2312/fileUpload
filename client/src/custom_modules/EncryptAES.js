import { lib, AES } from 'crypto-js';
import { randomBytes } from 'crypto';

class EncryptAES {
    encrypt(data) {
        //generate khóa k
        const key = randomBytes(128).toString('hex');
        // encrypt data
        var wordArray = lib.WordArray.create(data); // Convert: ArrayBuffer -> WordArray
        var en_data = AES.encrypt(wordArray, key).toString();
        return { key, en_data };
    }
    decrypt(data, key) {
        //decrypt data
        var decrypted = AES.decrypt(data, key);
        var typedArray = this.convertWordArrayToUint8Array(decrypted); // Convert: WordArray -> typed array
        return typedArray;
    }
}

export default new EncryptAES();
