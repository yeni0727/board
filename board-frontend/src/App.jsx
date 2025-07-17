import './styles/common.css'
import Navbar from './components/shared/Navbar'
import Home from './pages/Home'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import BoardWrite from './pages/BoardWrite'
import BoardEditPage from './pages/BoardEditPage'
import { Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatusThunk } from './features/authSlice'
import { useEffect } from 'react'
function App() {
   const dispatch = useDispatch()
   const { isAuthenticated, member, loading } = useSelector((state) => state.auth) // loading 추가

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])

   // console.log('Auth state:', { isAuthenticated, member, loading })

   if (loading) {
      return <div>Loading...</div>
   }

   return (
      <>
         <Navbar isAuthenticated={isAuthenticated} member={member} />
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/posts/create" element={<BoardWrite />} />
            // App.js 또는 router 설정 파일에
            <Route path="/board/edit/:id" element={<BoardEditPage />} />
         </Routes>
      </>
   )
}

export default App
