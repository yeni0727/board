/*import { Container, Typography, Pagination, Stack } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import BoardItem from '../components/post/BoardItem'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostsThunk } from '../features/boardSlice'

function Home({ isAuthenticated, user }) {
   const [page, setPage] = useState(1) // 현재페이지
   const dispatch = useDispatch()
   const { posts, pagination, loading, error } = useSelector((state) => state.board)

   useEffect(() => {
      dispatch(fetchPostsThunk(page)) // 전체 게시물 리스트 가져오기
   }, [dispatch, page])

   const handlePageChange = (event, value) => {
      setPage(value)
   }

   return (
      <Container maxWidth="md">
         <Typography variant="h4" align="center" gutterBottom>
            게시판
         </Typography>

         {loading && (
            <Typography variant="body1" align="center">
               로딩 중...
            </Typography>
         )}

         {error && (
            <Typography variant="body1" align="center" color="error">
               에러 발생: {error}
            </Typography>
         )}

         {posts.length > 0 ? (
            <>
               {posts.map((post) => (
                  <Accordion key={post.id} sx={{ mb: 2 }}>
                     <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls={`panel${post.id}-content`} id={`panel${post.id}-header`}>
                        <Typography component="span" variant="h6">
                           {post.title}
                        </Typography>
                     </AccordionSummary>
                     <AccordionDetails>
                        <BoardItem post={post} isAuthenticated={isAuthenticated} user={user} />
                     </AccordionDetails>
                  </Accordion>
               ))}
               <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                  <Pagination
                     count={pagination?.totalPages || 1} // 총 페이지수
                     page={page} // 현재 페이지
                     onChange={handlePageChange} // 페이지를 변경할 함수
                  />
               </Stack>
            </>
         ) : (
            // posts 데이터가 0개이면서 로딩중이 아닐때
            !loading && (
               <Typography variant="body1" align="center">
                  게시물이 없습니다.
               </Typography>
            )
         )}
      </Container>
   )
}

export default Home */

import { Container, Typography, Pagination } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import PostAddIcon from '@mui/icons-material/PostAdd'
import MessageIcon from '@mui/icons-material/Message'
import BoardItem from '../components/post/BoardItem'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostsThunk } from '../features/boardSlice'

function Home({ isAuthenticated, user }) {
   const [page, setPage] = useState(1) // 현재페이지
   const dispatch = useDispatch()
   const { posts, pagination, loading, error } = useSelector((state) => state.board)

   useEffect(() => {
      dispatch(fetchPostsThunk(page)) // 전체 게시물 리스트 가져오기
   }, [dispatch, page])

   const handlePageChange = (event, value) => {
      setPage(value)
   }

   return (
      <Container maxWidth="md" className="board-container">
         {/* 헤더 섹션 */}
         <div className="board-header">
            <div className="board-header-content">
               <MessageIcon sx={{ fontSize: 32 }} />
               <h1 className="board-header-title">게시판</h1>
            </div>
         </div>

         {/* 게시물 정보 */}
         {posts.length > 0 && (
            <div className="board-stats">
               <div className="board-stats-chip">
                  <PostAddIcon sx={{ fontSize: 16 }} />
                  <span>총 {posts.length}개 게시물</span>
               </div>
               <div className="board-stats-page">
                  {pagination?.totalPages || 1} 페이지 중 {page} 페이지
               </div>
            </div>
         )}

         {/* 로딩 상태 */}
         {loading && (
            <div className="board-status-card board-loading-card">
               <div className="board-status-content">
                  <div className="board-loading-spinner"></div>
                  <Typography className="board-loading-text">게시물을 불러오는 중...</Typography>
               </div>
            </div>
         )}

         {/* 에러 상태 */}
         {error && (
            <div className="board-status-card board-error-card">
               <Typography className="board-error-text">⚠️ 에러: {error}</Typography>
            </div>
         )}

         {/* 게시물 리스트 */}
         {posts.length > 0 ? (
            <>
               <div className="board-posts-container">
                  {posts.map((post, index) => (
                     <Accordion key={post.id} className="board-accordion">
                        <AccordionSummary expandIcon={<ArrowDropDownIcon className="board-accordion-icon" />} aria-controls={`panel${post.id}-content`} id={`panel${post.id}-header`} className="board-accordion-summary">
                           <div className="board-accordion-content">
                              <div className="board-post-number">#{index + 1 + (page - 1) * 5}</div>
                              <Typography component="span" variant="h6" className="board-post-title">
                                 {post.title}
                              </Typography>
                           </div>
                        </AccordionSummary>
                        <AccordionDetails className="board-accordion-details">
                           <BoardItem post={post} isAuthenticated={isAuthenticated} user={user} />
                        </AccordionDetails>
                     </Accordion>
                  ))}
               </div>

               {/* 페이지네이션 */}
               <div className="board-pagination-container">
                  <div className="board-pagination-wrapper">
                     <Pagination count={pagination?.totalPages || 1} page={page} onChange={handlePageChange} color="secondary" size="large" />
                  </div>
               </div>
            </>
         ) : (
            // posts 데이터가 0개이면서 로딩중이 아닐때
            !loading && (
               <div className="board-status-card board-empty-card">
                  <div className="board-status-content">
                     <PostAddIcon className="board-status-icon" />
                     <Typography variant="h6" className="board-status-title">
                        게시물이 없습니다
                     </Typography>
                     <Typography variant="body2" className="board-status-subtitle">
                        첫 번째 게시물을 작성해보세요!
                     </Typography>
                  </div>
               </div>
            )
         )}
      </Container>
   )
}

export default Home
