import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL

const boardApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json', //req,res를 json 객체로 주고받겠다
   },
   withCredentials: true, //세션이나 쿠키를 요청에 포함
})

// 회원 가입
export const registerMember = async (memberData) => {
   try {
      console.log('memberdata: ', memberData)
      const response = await boardApi.post('/auth/join', memberData)
      console.log('Response:', response) // response를 사용하여 출력
      return response
   } catch (error) {
      console.log(`API Request 오류: ${error.message}`)
      throw error
   }
}

// 로그인
export const loginMember = async (credential) => {
   try {
      console.log('credential: ', credential)
      const response = await boardApi.post('/auth/login', credential)
      console.log('response: ', response)
      return response
   } catch (error) {
      console.log(`API Request 오류: ${error.message}`)
      throw error
   }
}
// 로그아웃
export const logoutMember = async () => {
   try {
      const response = await boardApi.post('/auth/logout')
      return response
   } catch (error) {
      console.log(`API Request 오류: ${error.message}`)
      throw error
   }
}

// 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await boardApi.get('/auth/status')
      return response.data
   } catch (error) {
      console.log(`API Request 오류: ${error.message}`)
      console.error('Response:', error.response?.data)
      console.error('Status:', error.response?.status)
      throw error
   }
}

//업로드
export const uploadPost = async (formData) => {
   try {
      const response = await boardApi.post('/board', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      })
      return response.data
   } catch (error) {
      console.log(`API Request 오류: ${error.message}`)
      throw error
   }
}

//전체 게시글 가져오기(페이징)
export const getPosts = async (page) => {
   try {
      const response = await boardApi.get(`/board?page=${page}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 특정 게시글 가져오기
export const getPostById = async (id) => {
   try {
      const response = await boardApi.get(`/board/${id}`)
      return response.data
   } catch (error) {
      console.error('API Request 오류:', error.message)
      throw error
   }
}
//수정하기
export const updatePost = async (id, formData) => {
   try {
      const response = await boardApi.put(`/board/${id}`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      })
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.message}`)
      throw error
   }
}

//삭제하기
export const deletePost = async (id) => {
   try {
      const response = await boardApi.delete(`/board/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.message}`)
      throw error
   }
}
