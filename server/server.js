const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const app = express();
const route = require('./routes');
const db = require('./config/db');
const port = 5000;

app.use(fileUpload());

app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: 'somesecret',
        cookie: { maxAge: 60000 },
    }),
);

// Connect to DB
db.connect();

//login

// app.post('/login', (req, res) => {
//     if (req.username === null) {
//         return res.status(400).json({ msg: 'No file uploaded' });
//     }
//     const { username, password } = req.body; //lấy được username & password
//     //Xử lý

//     //Nếu user hợp lệ return true
//     res.json({ status: false });
// });

// register
// app.post('/register', (req, res) => {
//     if (req.username === null) {
//         return res.status(400).json({ msg: 'No file uploaded' });
//     }
//     const { username, password1, password2 } = req.body; //lấy được username & password
//     //Xử lý

//     //Nếu user hợp lệ return true
//     res.json({ status: false });
// });

// Upload Endpoint
app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;

    //1. Đọc file
    //2. Mã hóa file
    //3. Generate key + mã hóa k

    file.mv(`${__dirname}/client/public/uploads/$ file.name}`, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({ fileName: file.name });
    });
});

// Routes init
route(app);

//  Download Endpoint
app.listen(port, () => console.log(`Server started on port ${port}...`));