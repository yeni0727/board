import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { uploadPost, getPosts, updatePost, getPostById, deletePost } from '../api/boardApi'

// 게시물 등록
export const writePost = createAsyncThunk('board/writePost', async (formData, { rejectWithValue }) => {
   try {
      console.log('Data :', formData)
      const response = await uploadPost(formData)
      console.log(response)
      return response
   } catch (err) {
      return rejectWithValue(err.response?.data?.message)
   }
})

// 특정 게시물 불러오기
export const fetchPostByIdThunk = createAsyncThunk('board/fetchPostById', async (id, { rejectWithValue }) => {
   try {
      const response = await getPostById(id)
      return response.post || response.data || response
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//게시물 수정
export const updatePostThunk = createAsyncThunk('board/updatePost', async ({ id, formData }, { rejectWithValue }) => {
   try {
      console.log('Update Data:', formData)
      const response = await updatePost(id, formData)

      console.log('Update Response:', response)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//게시물 삭제
export const deletePostThunk = createAsyncThunk('board/deletePost', async (id, { rejectWithValue }) => {
   try {
      console.log('ID: ', id)
      const response = await deletePost(id)

      console.log('Response:', response)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 게시물 불러오기
export const fetchPostsThunk = createAsyncThunk('board/fetchPosts', async (page, { rejectWithValue }) => {
   try {
      console.log('page: ', page)
      const response = await getPosts(page)

      console.log(response)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const boardSlice = createSlice({
   name: 'board',
   initialState: {
      post: null, // 게시글 데이터 (수정용)
      posts: [], // 게시글 리스트 (배열형태라 빈배열로 줌)
      pagination: null, // 페이징 객체
      loading: false,
      error: null,
      // 수정 관련 상태 분리
      updateLoading: false,
      updateError: null,
   },
   reducers: {
      resetWriteState: (state) => {
         state.loading = false
         state.error = null
         // post는 리셋하지 않음 (수정 페이지에서 사용 중일 수 있음)
      },
      clearPost: (state) => {
         state.post = null
      },
   },
   extraReducers: (builder) => {
      // 게시물 등록
      builder
         .addCase(writePost.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(writePost.fulfilled, (state, action) => {
            state.loading = false
            state.post = action.payload
            // post 상태를 변경하지 않음
         })
         .addCase(writePost.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '게시물 등록 과정에서 오류가 발생했습니다'
         })

      // 특정 게시물 불러오기
      builder
         .addCase(fetchPostByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPostByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.post = action.payload
         })
         .addCase(fetchPostByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '게시물을 불러오는 중 오류가 발생했습니다'
         })

      // 게시물 리스트 불러오기
      builder
         .addCase(fetchPostsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPostsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.posts = action.payload.posts
            state.pagination = action.payload.pagination
         })
         .addCase(fetchPostsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '게시물을 불러오는 중 오류가 발생했습니다'
         })

      //수정
      builder
         .addCase(updatePostThunk.pending, (state) => {
            state.updateLoading = true
            state.updateError = null
         })
         .addCase(updatePostThunk.fulfilled, (state, action) => {
            state.updateLoading = false
            state.post = action.payload
         })
         .addCase(updatePostThunk.rejected, (state, action) => {
            state.updateLoading = false
            state.updateError = action.payload || '게시물 수정 중 오류가 발생했습니다'
         })

      //삭제
      builder
         .addCase(deletePostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deletePostThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(deletePostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '게시물 삭제 중 오류가 발생했습니다'
         })
   },
})

export const { resetWriteState, clearPost } = boardSlice.actions
export default boardSlice.reducer
