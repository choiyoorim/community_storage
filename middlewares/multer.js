const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDirectoryExistence = dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Multer 스토리지 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req.body);
        const { category } = req.body;
        console.log(`${category} uploaded`);
        const basePath = 'uploads/';
        let folder;

        switch (category) {
            case 'profile':
                folder = `${basePath}images/profile/`;
                break;
            case 'post':
                folder = `${basePath}images/post/`;
                break;
            case 'board':
                folder = `${basePath}logs/board/`;
                break;
            case 'comment':
                folder = `${basePath}logs/comment/`;
                break;
            case 'like':
                folder = `${basePath}logs/like/`;
                break;
            case 'user':
                folder = `${basePath}logs/user/`;
                break;
            case 'error':
                folder = `${basePath}logs/error/`;
                break;
            case 'exception':
                folder = `${basePath}logs/exception/`;
                break;
            default:
                folder = `${basePath}others/`;
                // 에러 리턴 필요
                break;
        }

        // 폴더 생성
        ensureDirectoryExistence(folder);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}`;
        const ext = path.extname(file.originalname);
        const baseName = Buffer.from(path.basename(file.originalname, ext), 'utf8');
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
});

// Multer 미들웨어 생성
const upload = multer({ storage });

module.exports = upload;
