const statusCode = require('../../constants/statusCode');
const responseMessage = require('../../constants/responseMessage');
const util = require('../../libs/util');
const path = require("node:path");
const fs = require('fs');
const sharp = require("sharp");

const getProfileImage = async (req, res) => {
    try {
        const {width, height, type} = req.query;
        const imageName = req.params.profileName;
        const acceptedTypes = ['px', 'percent'];
        const imageType = type && acceptedTypes.includes(type) ? type : 'px';

        if(!width || !height) {
            return res.status(statusCode.BAD_REQUEST).send(
                util.fail(
                    statusCode.BAD_REQUEST,
                    responseMessage.NO_WIDTH_OR_HEIGHT
                )
            );
        }

        const originalImagePath = path.join(__dirname, '../../uploads/images/profile', imageName);
        if (!fs.existsSync(originalImagePath)) {
            return res.status(statusCode.NOT_FOUND).send(
                util.fail(
                    statusCode.NOT_FOUND,
                    responseMessage.IMAGE_NOT_FOUND
                )
            );
        }

        const metadata = await sharp(originalImagePath).metadata();

        // 단위에 따른 크기 계산
        let widthInt, heightInt;
        if (imageType === 'px') {
            widthInt = parseInt(width);
            heightInt = parseInt(height);
        } else if (imageType === 'percent') {
            widthInt = Math.round((metadata.width * parseFloat(width)) / 100);
            heightInt = Math.round((metadata.height * parseFloat(height)) / 100);
        }

        if (isNaN(widthInt) || isNaN(heightInt)) {
            return res.status(statusCode.BAD_REQUEST).send(
                util.fail(
                    statusCode.BAD_REQUEST,
                    responseMessage.INVALID_DIMENSIONS
                )
            );
        }

        const resizedImagePath = path.join(__dirname, '../../uploads/images/profile/resized', `${widthInt}x${heightInt}_${imageName}`);
        if (fs.existsSync(resizedImagePath)) {
            return res.sendFile(resizedImagePath);
        }

        await sharp(originalImagePath)
            .resize(widthInt, heightInt)
            .toFile(resizedImagePath);

        res.sendFile(resizedImagePath);
    } catch (err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(
            util.fail(
                statusCode.INTERNAL_SERVER_ERROR,
                responseMessage.INTERNAL_SERVER_ERROR
            )
        )
    }
}

module.exports = getProfileImage;