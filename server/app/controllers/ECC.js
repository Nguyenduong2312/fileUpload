var eccrypto = require("eccrypto");

class ECC {
    encrypt(data, publicKey){
        return eccrypto.encrypt(publicKey, Buffer.from(data)).then(token => { return token } )
    }
    decrypt(en_data, privateKey){
        eccrypto.decrypt(privateKey, en_data).then(function(de_data){
            return de_data.toString()
        })
    }
}

module.exports = new ECC();
