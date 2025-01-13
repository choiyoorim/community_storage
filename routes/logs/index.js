const express = require('express');

const upload = require('../../middlewares/multer');
const postBoardLogs = require("../../controllers/logs/postBoardLogs");
const postCommentLogs = require("../../controllers/logs/postCommentLogs");
const postLikeLogs = require("../../controllers/logs/postLikeLogs");
const postUserLogs = require("../../controllers/logs/postUserLogs");
const postErrorLogs = require("../../controllers/logs/postErrorLogs");
const postExceptionLogs = require("../../controllers/logs/postExceptionLogs");

const router = express.Router();

router.post('/board', upload.single('log'), postBoardLogs);
router.post('/comment', upload.single('log'), postCommentLogs);
router.post('/like', upload.single('log'), postLikeLogs);
router.post('/user', upload.single('log'), postUserLogs);
router.post('/error', upload.single('log'), postErrorLogs);
router.post('/exception', upload.single('log'), postExceptionLogs);

module.exports = router;
