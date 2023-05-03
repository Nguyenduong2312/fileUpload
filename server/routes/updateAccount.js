const express = require('express');
const router = express.Router();
const UpdateAccountController = require('../app/controllers/updateAccountController');

router.put('/:id', UpdateAccountController.update);
router.get('/:id', UpdateAccountController.getInfor);
module.exports = router;
