const Sequelize = require('sequelize'); //

class Hashtag extends Sequelize.Model { //
    static initiate(sequelize) { //
        Hashtag.init({
            title: { //
                type: Sequelize.STRING(15), //
                allowNull: false, //
                unique: true, //
            },
        }, {
            sequelize, //
            timestamps: true, //
            modelName: 'Hashtag', //
            tableName: 'hashtags', //
            paranoid: false, //
            charset: 'utf8', //
            collate: 'utf8_general_ci', //
        });
    }

    static associate(db) { //
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
        //
        //
    }
};

module.exports = Hashtag; //