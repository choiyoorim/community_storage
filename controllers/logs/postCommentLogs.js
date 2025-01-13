const statusCode = require('../../constants/statusCode');
const responseMessage = require('../../constants/responseMessage');
const util = require('../../libs/util');

const postCommentLogs = async (req, res) => {
    return res.status(statusCode.OK).send(
        util.success(
            statusCode.OK,
            responseMessage.POST_COMMENT_LOG_SUCCESS,
        )
    )
};

module.exports = postCommentLogs;
