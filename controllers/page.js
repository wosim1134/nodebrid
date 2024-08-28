const Post = require("../models/post");


// 프로필 페이지를 렌더링하는 함수 정의
exports.renderProfile = (req, res) => {
    // 'profile' 템플릿 렌더링, 'title' 변수 설정
    res.render('profile', { title: '내 정보 - NodeBrid' });
};

// 회원 가입 페이지를 렌더링하는 함수 정의
exports.renderJoin = (req, res) => {
    // 'join' 템플릿 렌더링, 'title' 변수 설정
    res.render('join', { title: '회원 가입 - NodeBrid' });
};

// 메인 페이지를 렌더링하는 함수 정의
exports.renderMain = async (req, res, next) => {
    try {
        //
        const posts = await Post.findAll({
            //
            include: {
                model: User, 
                attributes: ['id', 'nick'],
            },
            //
            order: [['crestedAt', 'DESC']],
        });
         // 'main' 템플릿 렌더링, 'title' 및 'twits' 변수 설정
         //
        res.render('main', {
            title: 'NodeBrid', // 페이지 타이틀을 설정합니다.
            twits: posts, // 트윗 목록을 설정합니다.
        });
    } catch (err) {
        //
        console.error(err); //
        next(err); //
    }
}