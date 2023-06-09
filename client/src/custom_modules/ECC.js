import { encrypt, decrypt } from 'eccrypto';

class ECC {
    async encrypt(data, publicKey) {
        return await encrypt(publicKey, Buffer.from(data));
    }
    async decrypt(en_data, privateKey) {
        return (await decrypt(privateKey, en_data)).toString();
    }
}

export default new ECC();
