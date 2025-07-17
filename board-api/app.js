const express = require('express')
const path = require('path')
const { sequelize } = require('./models')
require('dotenv').config()
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')

// 라우터 모듈 불러오기
const authRouter = require('./routes/auth')
const boardRouter = require('./routes/board')

const app = express()
// 환경변수에서 포트 값 가져오고, 기본 포트 3001로 설정
app.set('port', process.env.PORT || 3001)

app.use(
   cors({
      origin: 'http://localhost:5173', // 프엔 주소
      credentials: true,
   })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
   session({
      secret: process.env.COOKIE_SECRET || 'secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
         httpOnly: true,
         secure: false,
      },
   })
)

// Passport 초기화 (세션 설정 후에 해야 함)
app.use(passport.initialize())
app.use(passport.session())

// Passport 설정 불러오기
const passportConfig = require('./passport')
passportConfig()

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) // 정적 파일 경로

// 라우터 연결
app.use('/auth', authRouter)
app.use('/board', boardRouter)

// 에러처리 미들웨어
app.use((err, req, res, next) => {
   console.error(err)
   res.status(500).json({
      success: false,
      message: err.message || '서버 오류가 발생했습니다.',
   })
})

// 데이터베이스 연결 및 서버 시작
sequelize
   .authenticate()
   .then(() => {
      console.log('데이터베이스 연결 성공')
      return sequelize.sync({ force: false })
   })
   .then(() => {
      app.listen(app.get('port'), () => {
         console.log(`서버가 작동 중 입니다. http://localhost:${app.get('port')}`)
      })
   })
   .catch((err) => {
      console.error('데이터베이스 연결 실패:', err)
   })
