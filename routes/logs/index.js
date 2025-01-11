const express = require('express');

const upload = require('../../middlewares/multer');
const postBoardLogs = require("../../controllers/logs/postBoardLogs");

const router = express.Router();

router.post('/board', upload.single('log'), postBoardLogs);
// router.post('/comment',postCommentLogs);
// router.post('/like',postLikeLogs);
// router.post('/user',postUserLogs);
// router.post('/error',postErrorLogs);
// router.post('/exception',postExceptionLogs);

module.exports = router;
