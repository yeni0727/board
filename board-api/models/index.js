const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]

const Member = require('./member')
const Board = require('./board')

const db = {}

const sequelize = new Sequelize(config.database, config.username, config.password, config)

// DB
db.sequelize = sequelize
db.Sequelize = Sequelize
db.Member = Member
db.Board = Board

//초기화
Member.init(sequelize)
Board.init(sequelize)

Object.keys(db).forEach((modelName) => {
   if (db[modelName].associate) {
      db[modelName].associate(db)
   }
})

module.exports = db
