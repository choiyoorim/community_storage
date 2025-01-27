const statusCode = require('../../constants/statusCode');
const responseMessage = require('../../constants/responseMessage');
const util = require('../../libs/util');
const ffmpeg = require('fluent-ffmpeg');
const ffprobeStatic = require('ffprobe-static');
const fs = require('fs'); // 파일 시스템 접근
const { promisify } = require('util');

ffmpeg.setFfprobePath(ffprobeStatic.path);

const deleteFile = promisify(fs.unlink); // 파일 삭제를 Promise 기반으로 변환

const postProfileImage = async (req, res) => {
    const profile_image = req.file;
    if (!profile_image) {
        return res.status(statusCode.BAD_REQUEST).send(
            util.fail(
                statusCode.BAD_REQUEST,
                responseMessage.NO_FILE_UPLOADED
            )
        );
    }

    const filePath = profile_image.path;

    // Step 1: MIME 타입 확인
    try {
        const { fileTypeFromBuffer } = await import('file-type'); // dynamic import
        const buffer = fs.readFileSync(filePath);
        const fileTypeResult = await fileTypeFromBuffer(buffer);

        const validMimeTypes = ['image/png', 'image/jpeg', 'video/mp4', 'video/webm', 'video/avi', 'video/mov'];

        if (!fileTypeResult || !validMimeTypes.includes(fileTypeResult.mime)) {
            await deleteFile(filePath); // 파일 삭제
            return res.status(statusCode.BAD_REQUEST).send(
                util.fail(
                    statusCode.BAD_REQUEST,
                    responseMessage.UNSUPPORTED_FILE_TYPE
                )
            );
        }
    } catch (error) {
        console.error('File type check error:', error.message);
        await deleteFile(filePath); // 파일 삭제
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(
            util.fail(
                statusCode.INTERNAL_SERVER_ERROR,
                responseMessage.INTERNAL_SERVER_ERROR
            )
        );
    }

    // Step 2: ffprobe를 통한 추가 검증
    ffmpeg.ffprobe(filePath, async function (err, metadata) {
        if (err) {
            console.error('ffprobe error:', err.message);
            await deleteFile(filePath); // 파일 삭제
            return res.status(statusCode.BAD_REQUEST).send(
                util.fail(
                    statusCode.BAD_REQUEST,
                    responseMessage.POST_PROFILE_IMAGE_FAIL
                )
            );
        }

        const { streams, format } = metadata;

        if (!streams || streams.length === 0) {
            await deleteFile(filePath); // 파일 삭제
            return res.status(statusCode.BAD_REQUEST).send(
                util.fail(
                    statusCode.BAD_REQUEST,
                    responseMessage.NO_STREAM,
                )
            );
        }

        const videoStream = streams.find((stream) => stream.codec_type === 'video');
        if (!videoStream) {
            await deleteFile(filePath); // 파일 삭제
            return res.status(statusCode.BAD_REQUEST).send(
                util.fail(
                    statusCode.BAD_REQUEST,
                    responseMessage.NOT_VIDEO_STREAM_TYPE,
                )
            );
        }

        const validImageFormats = ['image2', 'png_pipe','jpeg_pipe', 'gif', 'webp', 'image2pipe']
        const validVideoFormats = ['mp4', 'mov', 'avi', 'webm'];
        const allValidFormats = [...validImageFormats, ...validVideoFormats];

        if (!allValidFormats.includes(format.format_name)) {
            await deleteFile(filePath); // 파일 삭제
            return res.status(statusCode.BAD_REQUEST).send(
                util.fail(
                    statusCode.BAD_REQUEST,
                    responseMessage.UNSUPPORTED_FILE_TYPE,
                )
            );
        }

        // 파일 검증 성공 시
        return res.status(statusCode.OK).send(
            util.success(
                statusCode.OK,
                responseMessage.POST_PROFILE_IMAGE_SUCCESS,
                format.filename
            )
        );
    });
};

module.exports = postProfileImage;
