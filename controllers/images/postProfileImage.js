const statusCode = require('../../constants/statusCode');
const responseMessage = require('../../constants/responseMessage');
const util = require('../../libs/util');
const ffmpeg = require('fluent-ffmpeg');
const ffprobeStatic = require('ffprobe-static');

ffmpeg.setFfprobePath(ffprobeStatic.path);

const postProfileImage = async (req, res) => {
    const profile_image = req.file;
    if(!profile_image){
        return res.status(statusCode.BAD_REQUEST).send(
            util.fail(
                statusCode.BAD_REQUEST,
                responseMessage.NO_FILE_UPLOADED
            )
        )
    }
    const filePath = profile_image.path;

    ffmpeg.ffprobe(filePath, function (err, metadata) {
        if(err) {
            console.error('ffprobe error:', err.message);
            return res.status(statusCode.BAD_REQUEST).send(
                util.fail(
                    statusCode.BAD_REQUEST,
                    responseMessage.POST_PROFILE_IMAGE_FAIL
                )
            )
        }

        const { streams, format } = metadata;

        if (!streams || streams.length === 0) {
            return res.status(statusCode.BAD_REQUEST).send(
                util.fail(
                    statusCode.BAD_REQUEST,
                    responseMessage.NO_STREAM,
                )
            )
        }

        const videoStream = streams.find((stream) => stream.codec_type === 'video');
        if (!videoStream) {
            return res.status(statusCode.BAD_REQUEST).send(
                util.fail(
                    statusCode.BAD_REQUEST,
                    responseMessage.NOT_VIDEO_STREAM_TYPE,
                )
            )
        }

        const validImageFormats = ['image2'];
        const validVideoFormats = ['mp4', 'mov', 'avi', 'webm'];
        const allValidFormats = [...validImageFormats, ...validVideoFormats];

        if (!allValidFormats.includes(format.format_name)) {
            return res.status(statusCode.BAD_REQUEST).send(
                util.fail(
                    statusCode.BAD_REQUEST,
                    responseMessage.UNSUPPORTED_FILE_TYPE,
                )
            )
        }

        // 파일 검증 성공 시
        return res.status(statusCode.OK).send(
            util.success(
                statusCode.OK,
                responseMessage.POST_PROFILE_IMAGE_SUCCESS,
                format.filename
            )
        );
    })
};

module.exports = postProfileImage;
