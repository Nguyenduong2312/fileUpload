var eccrypto = require('eccrypto');

class ECC {
    async encrypt(data, publicKey) {
        return await eccrypto.encrypt(publicKey, Buffer.from(data));
    }
    async decrypt(en_data, privateKey) {
        return (await eccrypto.decrypt(privateKey, en_data)).toString();
    }
}

module.exports = new ECC();
