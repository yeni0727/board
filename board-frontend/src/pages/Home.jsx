import { Container, Typography, Pagination, Stack } from '@mui/material'
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

export default Home
