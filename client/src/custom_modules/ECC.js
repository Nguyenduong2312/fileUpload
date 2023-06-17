import { encrypt as _encrypt, decrypt as _decrypt } from 'eccrypto';

export const encrypt = async (data, publicKey) => {
    return await _encrypt(publicKey, Buffer.from(data));
};
export const decrypt = async (en_data, privateKey) => {
    return (await _decrypt(privateKey, en_data)).toString();
};
