const express = require('express'); // Express 모듈
const multer = require('multer'); // multer 모듈 -> 파일 업로드 처리
const path = require('path'); // path 모듈 -> 경로 설정
const fs = require('fs'); // fs 모듈 -> 파일 시스템

// post 컨트롤러 -> afterUploadImage 함수, uploadPost 함수
const { afterUploadImage, uploadPost } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares'); // 미들웨어 -> isLoggedIn 함수

const router = express.Router(); // 라우터 객체 생성

try {
    fs.readdirSync('uploads'); // 'uploads' 디렉토리의 파일 목록 읽기
} catch (error) {
    // 'uploads' 디렉토리가 없으면 에러 메시지 출력
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); // 'uploads' 디렉토리 생성
}

const upload = multer({
    storage: multer.diskStorage({ // multer 디스크 스토리지 설정
        destination(req, file, cb) { 
            cb(null, 'uploads/'); // 파일의 업로드될 디렉토리를 'uploads/'로 설정
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname); // 업로드된 파일의 확장자 추출
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext); 
            // 파일명에서 확장자 제거 -> 현재 시간과 함께 새로운 파일명 생성
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 업로드 파일 크기 제한 -> 5MB
});

// POST /post/img 엔드포인트 생성
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

const upload2 = multer(); // multer 객체 생성 -> 메모리 스토리지 사용
// POST /post 엔드포인트 생성
router.post('/', isLoggedIn, upload2.none(), uploadPost);

module.exports = router; // 라우터 객체를 모듈로 내보냄
