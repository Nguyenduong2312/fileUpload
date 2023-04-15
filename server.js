const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());

//login

app.post('/login', (req, res) => {
    if (req.username === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    console.log(req.body);
    const { username, password } = req.body  //lấy được username & password
    //Xử lý 
    console.log(username, password);
    console.log(req.body);
    //Nếu user hợp lệ return true
    res.json({status: false})
});

// register
app.post('/register', (req, res) => {
    if (req.username === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    const { username, password1, password2 } = req.body  //lấy được username & password
    //Xử lý 

    //Nếu user hợp lệ return true
    res.json({status: false})
});

// Upload Endpoint
app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    const id = req.body.name
    const file = req.files.file;
    console.log('id:',id);

    //1. Đọc f
    //1. Đọc file
    //2. Mã hóa file
    //3. Generate key + mã hóa k
    //

    file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({ fileName: file.name });
    });
});


//  Download Endpoint
app.listen(5000, () => console.log('Server Started...'));
