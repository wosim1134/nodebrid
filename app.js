const express = require('express'); // express 모듈로 app 객체 생성
const cookieParser = require('cookie-parser'); // 쿠키를 파싱하기 위한 미들웨어
const morgan = require('morgan'); // HTTP 요청 로깅을 위한 미들웨어
const path = require('path'); // 파일 및 디렉토리 경로를 다루기 위한 path 모듈
const session = require('express-session'); // 세션 관리를 위한 미들웨어
const nunjucks = require('nunjucks'); // 템플릿 엔진: nunjucks
const dotenv = require('dotenv'); // 환경 변수 관리

// .env 파일에 정의된 환경 변수를 로드
dotenv.config();
const pageRouter = require('./routes/page'); // 페이지 라우터를 불러오기
const { sequelize } = require('./models'); //

// express 애플리케이션 생성
const app = express();
app.set('port', process.env.PORT || 8001); // 포트 설정을 환경 변수에서 가져오거나 기본값으로 8001 사용
app.set('view engine', 'html'); // 뷰 엔진을 'html'로 설정
// nunjucks 설정하여 'views' 디렉토리 템플릿 파일이 위치한 곳으로 지정
nunjucks.configure('views', {
    express: app, // express 애플리케이션에 연결
    watch: true, // 템플릿 파일이 변경될 때 자동으로 다시 로드되도록 설정
});
//
sequelize.sync({ force: false }) //
    .then(() => { //
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => { //
        console.error(err);
    });

app.use(morgan('dev')); // HTTP 요청 로그를 출력하는 미들웨어 추가
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공을 위한 디렉토리 설정
app.use(express.json()); // JSON 형식의 요청 본문을 파싱하기 위한 미들웨어 추가
app.use(express.urlencoded({ extended: false })); // URL 인코딩된 요청 본문을 파싱하기 위한 미들웨어 추가
app.use(cookieParser(process.env.COOKIE_SECRET)); // 서명된 쿠키를 파싱하기 위한 미들웨어 추가
app.use(session({
    resave: false, // 세션을 항상 다시 저장하지 않도록 설정
    saveUninitialized: false, // 초기화되지 않은 세션을 저장하지 않도록 설정
    secret: process.env.COOKIE_SECRET, // 쿠키 서명을 위한 비밀 키 설정
    cookie: {
        httpOnly: true, // 클라이언트에서 쿠키를 자바스크립트로 접근하지 못하도록 설정
        secure: false, // HTTPS가 아닌 환경에서도 쿠키가 전송되도록 설정
    },
}));

app.use('/', pageRouter); // '/' 경로로 들어오는 요청을 pageRouter로 처리하도록 설정

// 요청한 라우터가 없을 경우 404 에러를 처리하는 미들웨어 추가
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error); // 에러를 다음 미들웨어로 전달
});

// 에러를 처리하는 미들웨어 추가
app.use((err, req, res, next) => {
    res.locals.message = err.message; // 에러 메시지를 로컬변수에 설정
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 개발 환경에서만 에러 스택 노출
    res.status(err.status || 500); // 에러 상태 코드 설정
    res.render('error'); // 'error' 템플릿 렌더링
});

// 설정된 포트에서 서버를 시작하고 대기
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
})