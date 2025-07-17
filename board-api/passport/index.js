const passport = require('passport')
const local = require('./localStrategy')
const { Member } = require('../models')

module.exports = () => {
   passport.serializeUser((member, done) => {
      if (process.env.NODE_ENV === 'development') {
         console.log('🧚‍♀️:', member.id)
      }
      done(null, member.id)
   })

   passport.deserializeUser(async (id, done) => {
      try {
         const member = await Member.findByPk(id, {
            attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
         })

         if (!member) {
            return done(new Error('사용자를 찾을 수 없습니다.'), null)
         }

         if (process.env.NODE_ENV === 'development') {
            console.log('🧚‍♀️:', member.id)
         }

         done(null, member)
      } catch (err) {
         console.error('error: ', err)
         done(err)
      }
   })

   local()
}
