var eccrypto = require('eccrypto');
const fs = require('fs');

var privateKeyA = eccrypto.generatePrivate();
var publicKeyA = eccrypto.getPublic(privateKeyA);
var privateKeyB = eccrypto.generatePrivate();
var publicKeyB = eccrypto.getPublic(privateKeyB);

const EncyptAES = require('./EncryptAES');
const ECC = require("./ECC");


class UploadFileController {
    upload(req, res) {
        if (req.files === null) {
            console.log('lỗi');
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        //uploadFile
        const file = req.files.file;
            //lưu file vào public/uploads
        const path = `${process.cwd()}/client/public/uploads/`;
        file.mv(path + file.name, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
            try {
                const data = fs.readFileSync(path + file.name, 'utf8');
                //generate khóa k và mã hóa nội dung tập tin
                const {key, en_data} = EncyptAES.AES(data)
                try {
                    fs.writeFileSync(path + 'en_' + file.name,en_data);
                    // file written successfully
                } catch (err) {
                    console.error(err);
                }
                //mã hóa k bằng ECC
                    //1. Lấy public key từ id BN
                const idBN = req.body.name
                console.log(idBN);
                    //2. Mã hóa khóa k
                ECC.encrypt(key, publicKeyB).then(function(en_data) {
                    console.log(en_data);// en_key
                    // 
                })
            } catch (err) {
                console.error(err);
            }
    
        })
    res.json({ status: true });
    }
}

module.exports = new UploadFileController();
