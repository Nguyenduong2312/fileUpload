import { encrypt as _encrypt, decrypt as _decrypt } from 'eccrypto';

class ECC {
    async encrypt(data, publicKey) {
        return await _encrypt(publicKey, Buffer.from(data));
    }
    async decrypt(en_data, privateKey) {
        return (await _decrypt(privateKey, en_data)).toString();
    }
}

export default new ECC();
