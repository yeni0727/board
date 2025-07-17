import { TextField, Button, Box } from '@mui/material'
import { useState } from 'react'

function BoardWriteForm({ title, content, setTitle, setContent, handleSubmit }) {
   const [previewUrl, setPreviewUrl] = useState('') // 이미지 미리보기용
   const [rawImageFile, setRawImageFile] = useState(null) // 원본 이미지 파일

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
   }

   const wrappedHandleSubmit = (e) => {
      e.preventDefault()

      if (!title.trim()) {
         alert('제목을 입력해주세요.')
         return
      }
      if (!content.trim()) {
         alert('내용을 입력해주세요.')
         return
      }
      if (!rawImageFile) {
         alert('이미지를 업로드해주세요.')
         return
      }

      // 한글 파일명 인코딩
      const encodedFile = new File([rawImageFile], encodeURIComponent(rawImageFile.name), {
         type: rawImageFile.type,
      })

      // 상위 컴포넌트로 이미지와 함께 전달
      handleSubmit(e, encodedFile)
   }

   return (
      <Box component="form" onSubmit={wrappedHandleSubmit} encType="multipart/form-data">
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

         <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }}>
            등록하기
         </Button>
      </Box>
   )
}

export default BoardWriteForm
