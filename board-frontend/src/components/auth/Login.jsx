import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginMemberThunk } from '../../features/authSlice'

function Login() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)

   //로그인 버튼 눌렀을때
   const handleLogin = (e) => {
      e.preventDefault()
      if (!email.trim() || !password.trim()) {
         alert('이메일과 패스워드를 입력해주세요')
         return
      }

      dispatch(loginMemberThunk({ email, password }))
         .unwrap()
         .then(() => navigate('/')) //로그인 성공시 메인 페이지로 이동
         .catch((error) => console.error('로그인실패:', error))
   }
   return (
      <Container maxWidth="sm">
         <Typography variant="h4" gutterBottom>
            로그인
         </Typography>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <form onSubmit={handleLogin}>
            <TextField label="이메일" name="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} color="secondary" />

            <TextField label="비밀번호" type="password" name="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} color="secondary" />

            <Button variant="contained" color="secondary" type="submit" fullWidth disabled={loading} sx={{ position: 'relative', marginTop: '20px' }}>
               {loading ? (
                  <CircularProgress
                     size={24}
                     sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                     }}
                  />
               ) : (
                  '로그인'
               )}
            </Button>
         </form>

         <p>
            계정이 없으신가요? <Link to="/signup"> 회원가입</Link>
         </p>
      </Container>
   )
}

export default Login
