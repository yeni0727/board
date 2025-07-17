exports.isLoggedIn = (req, res, next) => {
   if (req.isAuthenticated()) {
      next() //로그인이 됐으면 다음 미들웨어로 이동
   } else {
      const error = new Error('로그인이 필요합니다.')
      error.status = 403
      return next(error)
   }
}

//비로그인 상태 확인 미들웨어
exports.isNotLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      //로그인 되지 않았을 경우 다음 미들웨어로 이동
      next()
   } else {
      //로그인 된 경우 에러 미들웨어로 에러전송
      const error = new Error('이미 로그인이 된 상태입니다.')
      error.status = 400
      return next(error)
   }
}
