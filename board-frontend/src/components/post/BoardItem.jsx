import { Card, CardMedia, CardContent, Typography, Box, CardActions, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import dayjs from 'dayjs' //날짜 시간 포맷해주는 패키지
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deletePostThunk } from '../../features/boardSlice'

function BoardItem({ post }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const onClickDelete = (id) => {
      const result = confirm('삭제하시겠습니까?')
      if (result) {
         dispatch(deletePostThunk(id))
            .unwrap()
            .then(() => {
               navigate('/')
            })
            .catch((error) => {
               console.error('삭제중 오류발생', error)
               alert('삭제중 오류 발생' + error)
            })
      }
   }

   return (
      <Card style={{ margin: '20px 0' }}>
         {post.img && <CardMedia sx={{ height: 400, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} image={`${import.meta.env.VITE_APP_API_URL}/uploads/${post.img}`} title={post.title} />}
         <CardContent>
            {/* 작성자 정보 - Member 모델 기준 */}
            <Link to={`/my/${post.Member.id}`} style={{ textDecoration: 'none' }}>
               <Typography sx={{ color: 'primary.main' }}>@{post.Member.name}</Typography>
            </Link>

            {/* 작성일 */}
            <Typography variant="body2" color="text.secondary">
               {dayjs(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Typography>

            {/* 제목 */}
            <Typography variant="h6" component="div" sx={{ mt: 1 }}>
               {post.title}
            </Typography>

            {/* 내용 */}
            <Typography variant="body2" sx={{ mt: 1 }}>
               {post.content}
            </Typography>
         </CardContent>

         <CardActions>
            {/* 좋아요 버튼 */}
            <Button size="small" color="error">
               <FavoriteBorderIcon fontSize="small" />
            </Button>

            <Box sx={{ p: 2 }}>
               <Link to={`/board/edit/${post.id}`}>
                  <IconButton aria-label="edit" size="small">
                     <EditIcon fontSize="small" />
                  </IconButton>
               </Link>
               <IconButton aria-label="delete" size="small" onClick={() => onClickDelete(post.id)}>
                  <DeleteIcon fontSize="small" />
               </IconButton>
            </Box>
         </CardActions>
      </Card>
   )
}

export default BoardItem
