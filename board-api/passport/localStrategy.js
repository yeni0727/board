const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { Member } = require('../models')

// 로그인 시 사용자 정보를 db에서 조회하고 사용자 존재 여부와 비밀번호 비교
module.exports = () => {
   passport.use(
      new LocalStrategy(
         {
            // input태그에서 name으로 사용하는 이름을 지정
            usernameField: 'email',
            passwordField: 'password',
         },
         async (email, password, done) => {
            try {
               // 1. 이메일로 사용자 조회
               const exMember = await Member.findOne({ where: { email } })

               // 2. 해당하는 사용자가 있으면 비번이 맞는지 확인
               if (exMember) {
                  const result = await bcrypt.compare(password, exMember.password)
                  if (result) {
                     // 일치할때 사용자 객체를 passport에 반환
                     done(null, exMember)
                  } else {
                     done(null, false, { message: '비밀번호가 일치하지 않습니다' })
                  }
               } else {
                  // 3. 사용자가 없을경우
                  done(null, false, { message: '가입되지 않은 회원입니다.' })
               }
            } catch (error) {
               console.error('LocalStrategy error:', error)
               done(error) // passport에 에러 객체 전달
            }
         }
      )
   )
}
