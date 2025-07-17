import { TextField, Button, Box } from '@mui/material'
import { useState, useEffect } from 'react'

function BoardEditForm({ initialValues, onPostEdit, loading }) {
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [previewUrl, setPreviewUrl] = useState('') // 이미지 미리보기용
   const [rawImageFile, setRawImageFile] = useState(null) // 원본 이미지 파일
   const [imageChanged, setImageChanged] = useState(false) //변경이미지(했을때)

   // initialValues가 변경될 때 폼 데이터 설정
   useEffect(() => {
      if (initialValues) {
         setTitle(initialValues.title || '')
         setContent(initialValues.content || '')

         // 기존 이미지가 있다면 미리보기로 설정
         if (initialValues.img) {
            setPreviewUrl(`${import.meta.env.VITE_APP_API_URL}/uploads/${initialValues.img}`)
         }
      }
   }, [initialValues])

   const handleImageChange = (e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return

      // 미리보기
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
         setPreviewUrl(event.target.result)
      }

      setRawImageFile(file)
      setImageChanged(true)
   }

   //내용 전송
   const handleSubmit = (e) => {
      e.preventDefault()

      if (!title.trim()) {
         alert('제목을 입력해주세요.')
         return
      }
      if (!content.trim()) {
         alert('내용을 입력해주세요.')
         return
      }

      let fileToSend = null

      if (imageChanged && rawImageFile) {
         fileToSend = new File([rawImageFile], encodeURIComponent(rawImageFile.name), {
            type: rawImageFile.type,
         })
      }

      // 수정된 데이터 구성
      const postData = {
         title,
         content,
         imageFile: fileToSend,
         imageChanged,
         // 기존 이미지 URL 유지 (이미지가 변경되지 않은 경우)
         imageUrl: !imageChanged ? initialValues?.imageUrl : null,
      }

      // 상위 컴포넌트로 전달
      onPostEdit(postData)
   }

   return (
      <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
         <TextField label="제목" color="secondary" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 2 }} required />
         <TextField label="내용" color="secondary" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} sx={{ mt: 2 }} required />

         <Button variant="contained" color="secondary" component="label" sx={{ mt: 2 }} style={{ marginLeft: '10px', marginRight: '10px' }}>
            이미지 업로드
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
         </Button>

         {previewUrl && (
            <Box mt={2}>
               <img src={previewUrl} alt="미리보기" style={{ width: '400px', maxHeight: '300px', objectFit: 'contain' }} />
            </Box>
         )}

         <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }} disabled={loading}>
            {loading ? '수정 중...' : '수정하기'}
         </Button>
      </Box>
   )
}

export default BoardEditForm
