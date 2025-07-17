const Sequelize = require('sequelize')

module.exports = class Board extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            title: {
               type: Sequelize.STRING(255),
               allowNull: false,
            },
            content: {
               type: Sequelize.TEXT,
               allowNull: false,
            },
            img: {
               type: Sequelize.STRING(255),
               allowNull: true,
            },
            memberId: {
               type: Sequelize.INTEGER,
               allowNull: false,
               references: {
                  model: 'member',
                  key: 'id',
               },
            },
         },
         {
            sequelize,
            timestamps: true, // createdAt, updatedAt 자동 생성
            underscored: false,
            modelName: 'Board',
            tableName: 'board',
            paranoid: true, // deletedAt 생성
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }

   static associate(db) {
      db.Board.belongsTo(db.Member, {
         foreignKey: 'memberId',
         targetKey: 'id',
      })
   }
}
