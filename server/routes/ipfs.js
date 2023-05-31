const express = require('express');
const router = express.Router();

const IPFSController = require('../app/controllers/IPFSController');

router.post('/upload', IPFSController.upFile);
router.get('/download', IPFSController.downFile);
module.exports = router;
