const { Post, Hashtag } = require('../models'); // Sequelize 모델 -> Post, Hashtag 가져오기

// 이미지 업로드 처리를 담당하는 함수
exports.afterUploadImage = (req, res) => {
    console.log(req.file); // 업로드된 파일 객체의 정보를 콘솔에 출력
    // 업로드된 파일의 경로를 JSON 응답으로 클라이언트에 전송
    res.json({ url: `/img/${req.file.filename}` });
};

// 게시물 업로드를 처리하는 비동기 함수
exports.uploadPost = async (req, res, next) => {
    try {
        // 데이터베이스에 새로운 게시물 생성
        const post = await Post.create({
            content: req.body.content, // 요청 본문에서 게시물 내용을 가져와 설정
            img: req.body.url, // 요청 본문에서 이미지 URL을 가져와 설정
            UserId: req.user.id, // 현재 로그인한 사용자의 ID를 가져와 설정
        });

        // 게시물 내용에서 해시태그를 정규표현식을 이용해 추출
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            // 해시태그 배열을 순회하며 데이터베이스에 저장
            const result = await Promise.all(
                hashtags.map(tag => 
                    // 해시태그를 소문자로 변환하여 데이터베이스에 저장
                    Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                )
            );
            // 생성된 게시물과 해시태그를 연결
            await post.addHashtags(result.map(r => r[0]));
        }

        res.redirect('/'); // 모든 작업이 완료되면 홈 페이지로 리다이렉트
    } catch (err) {
        console.error(err); // 오류가 발생하면 콘솔에 출력
        next(err); // 오류를 다음 미들웨어로 전달 -> 오류 처리기를 실행
    }
};
