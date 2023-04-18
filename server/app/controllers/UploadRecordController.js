var eccrypto = require("eccrypto");
const fs = require('fs');

var privateKeyA = eccrypto.generatePrivate();
var publicKeyA = eccrypto.getPublic(privateKeyA);
var privateKeyB = eccrypto.generatePrivate();
var publicKeyB = eccrypto.getPublic(privateKeyB);


class UploadFileController {
    upload(req, res){
        if (req.files === null) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        
        const file = req.files.file;
        //lưu file vào public/uploads
        const path = `${process.cwd()}/client/public/uploads/`;
        file.mv(path + file.name, err => {
            if (err) {
            console.error(err);
            return res.status(500).send(err);
            }
            fs.readFile(path + file.name, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                const en = eccrypto.encrypt(publicKeyB, Buffer.from(data))
                en.then(function(encrypted){
                    //tạo en_file 
                    try {
                        fs.writeFileSync(path + 'en_' + file.name, JSON.stringify(encrypted));
                        // file written successfully
                      } catch (err) {
                        console.error(err);
                      }
                    //upload en_file to cloud
    
                    //xóa tất cả file trong folder upload
                })
            });
        });
    console.log("1111");
    res.json({ status: true });
    }
}

module.exports = new UploadFileController();
