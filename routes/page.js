// express 모듈을 불러와서 라우터 객체를 생성
const express = require('express');
//
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
// 각 페이지를 렌더링하는 컨트롤러 함수들을 불러옴
const { 
    renderProfile, 
    renderJoin, 
    renderMain,
    renderHashtag, //
} = require('../controllers/page');

const router = express.Router(); // express 라우터 객체 생성

// 모든 요청에 대해 공통적으로 수행할 작업을 정의하는 미들웨어 추가
router.use((req, res, next) => {
    //
    res.locals.user = req.user; // 사용자 정보 초기화
    //
    res.locals.followerCount = req.user?.Followers?.length || 0; // 팔로워 수 초기화
    //
    res.locals.followingCount = req.user?.Followings?.length || 0; // 팔로잉 수 초기화
    //
    //
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || []; // 팔로잉 ID 리스트 초기화
    next(); // 다음 미들웨어 또는 라우터로 제어를 전달
});

// '/profile' 경로로 GET 요청이 들어오면 renderProfile 컨트롤러 실행
router.get('/profile', isLoggedIn, renderProfile);
// '/join' 경로로 GET 요청이 들어오면 renderJoin 컨트롤러 실행
router.get('/join', isNotLoggedIn, renderJoin);
// 루트 경로('/')로 GET 요청이 들어오면 renderMain 컨트롤러 실행
router.get('/', renderMain);
//
router.get('/hashtag', renderHashtag);

module.exports = router; // 라우터 객체를 모듈로 내보냄