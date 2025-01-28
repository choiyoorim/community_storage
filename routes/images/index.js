const express = require('express');

const upload = require('../../middlewares/multer');

const router = express.Router();
const postProfileImage = require('../../controllers/images/postProfileImage');
const getProfileImage = require("../../controllers/images/getProfileImage");

// router.get('/profile', getProfileImage);
router.post('/profile', upload.single('profile_image'), postProfileImage);
router.get('/profile/:profileName', getProfileImage);

module.exports = router;
