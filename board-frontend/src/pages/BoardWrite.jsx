import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { writePost, resetWriteState } from '../features/boardSlice'
import BoardWriteForm from '../components/post/BoardWriteForm'
import { useNavigate } from 'react-router-dom'

function BoardWrite() {
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')

   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error, post } = useSelector((state) => state.board)

   // handleSubmit에서 이미지를 받으므로 image 상태는 필요 없음
   const handleSubmit = (e, imageFile) => {
      e.preventDefault()

      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      if (imageFile) formData.append('img', imageFile)

      dispatch(writePost(formData))
   }

   useEffect(() => {
      // console.log('=== useEffect 실행 ===')
      // console.log('현재 post 값:', post)
      // console.log('현재 loading 값:', loading)
      // console.log('현재 error 값:', error)
      if (post) {
         alert('게시글 업로드 성공')
         setTitle('')
         setContent('')
         navigate('/')
         dispatch(resetWriteState())
      } else if (error) {
         alert('게시글 업로드 실패')
      }
   }, [post, error, dispatch, navigate])

   return (
      <div>
         {loading && <p>업로드 중...</p>}
         <BoardWriteForm
            title={title}
            content={content}
            setTitle={setTitle}
            setContent={setContent}
            handleSubmit={handleSubmit} // handleSubmit에만 전달
         />
      </div>
   )
}

export default BoardWrite
