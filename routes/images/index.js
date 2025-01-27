const express = require('express');

const upload = require('../../middlewares/multer');

const router = express.Router();
const postProfileImage = require('../../controllers/images/postProfileImage');

// router.get('/profile', getProfileImage);
router.post('/profile', upload.single('profile_image'), postProfileImage);


module.exports = router;
