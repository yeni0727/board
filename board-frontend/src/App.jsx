import './styles/common.css'
import Navbar from './components/shared/Navbar'
import Home from './pages/Home'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import BoardWrite from './pages/BoardWrite'
import BoardEditPage from './pages/BoardEditPage'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatusThunk } from './features/authSlice'
import { useEffect } from 'react'
function App() {
   const dispatch = useDispatch()
   const { isAuthenticated, member, loading } = useSelector((state) => state.auth)

   const location = useLocation()
   console.log('location.key: ', location.key)

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])

   if (loading) {
      return <div>로딩중</div>
   }

   return (
      <>
         <Navbar isAuthenticated={isAuthenticated} member={member} />
         <Routes>
            <Route path="/" element={<Home key={location.key} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/posts/create" element={<BoardWrite />} />
            <Route path="/board/edit/:id" element={<BoardEditPage />} />
         </Routes>
      </>
   )
}

export default App
