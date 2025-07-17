import { Container } from '@mui/material'
import BoardEditForm from '../components/post/BoardEditForm'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostByIdThunk, updatePostThunk } from '../features/boardSlice'

function BoardEditPage() {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { id } = useParams() // board의 id를 path 파라메터에서 가져온다
   const { post, loading, error, updateLoading, updateError } = useSelector((state) => state.board)

   // 게시물 데이터 불러오기
   useEffect(() => {
      dispatch(fetchPostByIdThunk(id))
   }, [dispatch, id])

   // 게시물 수정
   const onPostEdit = (postData) => {
      // FormData로 변환
      const formData = new FormData()
      formData.append('title', postData.title)
      formData.append('content', postData.content)

      // 이미지 처리
      if (postData.imageChanged && postData.imageFile) {
         formData.append('image', postData.imageFile)
      }

      // 서버로 데이터 전송
      dispatch(updatePostThunk({ id, formData }))
         .then((response) => {
            // 성공적으로 수정된 후
            console.log('수정 성공', response)
            navigate('/')
         })
         .catch((error) => {
            console.error('게시물 수정 중 오류 발생:', error)
            alert('게시물 수정에 실패했습니다: ' + error)
         })
   }

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>오류: {error}</p>
   if (updateError) return <p>수정 오류: {updateError}</p>

   return (
      <Container maxWidth="md">
         <h1>게시물 수정</h1>
         {post && <BoardEditForm onPostEdit={onPostEdit} initialValues={post} loading={updateLoading} />}
      </Container>
   )
}

export default BoardEditPage
