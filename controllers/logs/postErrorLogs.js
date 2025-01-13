const statusCode = require('../../constants/statusCode');
const responseMessage = require('../../constants/responseMessage');
const util = require('../../libs/util');

const postErrorLogs = async (req, res) => {
    return res.status(statusCode.OK).send(
        util.success(
            statusCode.OK,
            responseMessage.POST_ERROR_LOG_SUCCESS,
        )
    )
};

module.exports = postErrorLogs;
