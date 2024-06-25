const Sequelize = require('sequelize'); // Sequelize 모듈

class Post extends Sequelize.Model { // Post 모델을 정의하는 클래스
    static initiate(sequelize) { // 모델을 초기화하는 정적 메서드, 매개변수: sequelize 인스턴스
        Post.init({
            contect: { // contect 필드
                type: Sequelize.STRING(140), // 최대 140자의 문자열 타입
                allowNull: false, // null 값 허용 X
            },
            img: { // img 필드
                type: Sequelize.STRING(200), // 최대 200자의 문자열 타입
                allowNull:true, // null 값 허용
            }
        }, {
            sequelize, // Sequelize 인스턴스 연결
            timestamps: true, // crestedAt, updatedAt 타임스탬프 자동 추가
            underscored: false, // 필드 이름을 카멜 케이스로 유지
            modelName: 'Post', // 모델 이름: 'Post'
            tableName: 'posts', // 테이블 이름 'posts'
            paranoid: false, // deletedAt 타임스탬프 추가 -> 소프트 삭제 활성화
            charset: 'utf8', // 테이블의 문자 집합: UTF-8
            collate: 'utf8_general_ci', // 테이블 정렬 기준: UTF-8 일반 대소문자 구분 없이 설정
        });
    }

    static associate(db) { //
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
        // Post 모델은 여러 Post 모델과 다대다 관계
        // 중간 테이블 'PostHashtag'를 통해 설정
    }
}

module.exports = Post; // Post 객체를 모델로 내보냄