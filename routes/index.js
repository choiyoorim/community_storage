const express = require('express');

const router = express.Router();

router.use('/logs', require('./logs'));
// router.use('/images', require('./images'));

module.exports = router;
