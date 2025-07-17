import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CreateIcon from '@mui/icons-material/Create'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutMemberThunk } from '../../features/authSlice'
import HomeIcon from '@mui/icons-material/Home'
import { pink } from '@mui/material/colors'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'

function Navbar({ isAuthenticated, member }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   // 로그아웃 버튼을 눌렀을때 로그아웃
   const handleLogout = () => {
      dispatch(logoutMemberThunk())
         .unwrap()
         .then(() => {
            navigate('/')
         })
         .catch((error) => {
            alert('로그아웃 실패:', error)
         })
   }

   return (
      <AppBar position="static" style={{ backgroundColor: '#fff', marginBottom: 50 }}>
         <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
               <Link to="/">
                  <HomeIcon sx={{ color: pink[500] }} fontSize="large" />
               </Link>
            </Typography>
            {isAuthenticated ? (
               <>
                  <Link to="/posts/create">
                     <AddPhotoAlternateOutlinedIcon aria-label="글쓰기" style={{ marginRight: '10px' }} fontSize="large" sx={{ color: pink[500] }}>
                        <CreateIcon />
                     </AddPhotoAlternateOutlinedIcon>
                  </Link>

                  <Link to="/my" style={{ textDecoration: 'none' }}>
                     <Typography variant="body1" style={{ marginRight: '20px', color: 'black' }}>
                        {member?.name}님
                     </Typography>
                  </Link>
                  <Button onClick={handleLogout} variant="outlined" color="secondary">
                     로그아웃
                  </Button>
               </>
            ) : (
               <Link to="/login">
                  <Button variant="contained" color="secondary">
                     로그인
                  </Button>
               </Link>
            )}
         </Toolbar>
      </AppBar>
   )
}

export default Navbar
