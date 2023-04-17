const { generateKeyPair } = require('crypto');

module.exports = function (password) {
    generateKeyPair(
        'rsa',
        {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: password,
            },
        },
        (err, publicKey, privateKey) => {
            // Handle errors and use the generated key pair.
            return { publicKey, privateKey };
        },
    );
};
