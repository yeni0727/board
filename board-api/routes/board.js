const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { Board, Member } = require('../models')
const { isLoggedIn } = require('./middlewares')

const router = express.Router()

const uploadDir = path.join(__dirname, '../uploads')

// 업로드 폴더 있는지 없으면 만들기
try {
   fs.readdirSync(uploadDir)
} catch (error) {
   console.log('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
   fs.mkdirSync(uploadDir)
}

// multer 설정 (uploads 폴더에 저장)
const upload = multer({
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, 'uploads/') // 상대 경로
      },
      filename(req, file, cb) {
         const decodeFileName = decodeURIComponent(file.originalname) // 한글명 깨짐 방지
         const ext = path.extname(decodeFileName)
         const basename = path.basename(decodeFileName, ext)
         cb(null, basename + Date.now() + ext)
      },
   }),
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
})

// 게시글 작성
router.post('/', isLoggedIn, upload.single('img'), async (req, res, next) => {
   try {
      console.log('file:', req.file) // 파일 확인
      const { title, content } = req.body
      const img = req.file ? req.file.filename : null

      const board = await Board.create({
         title,
         content,
         img,
         memberId: req.user.id,
      })

      res.status(201).json({
         success: true,
         message: '게시글이 등록되었습니다.',
         post: {
            id: board.id,
            title: board.title,
            content: board.content,
            img: board.img,
            memberId: board.memberId,
         },
      })
   } catch (error) {
      error.status = 500
      error.message = '게시물 등록 중 오류가 발생했습니다.'
      next(error)
   }
})

//게시글 수정
router.put('/:id', isLoggedIn, upload.single('img'), async (req, res, next) => {
   try {
      const post = await Board.findOne({
         where: { id: req.params.id, memberId: req.user.id },
      })

      if (!post) {
         const error = new Error('게시물을 찾을 수 없습니다.')
         error.status = 404
         return next(error)
      }

      await post.update({
         title: req.body.title,
         content: req.body.content,
         img: req.file ? req.file.filename : post.img,
      })

      res.status(200).json({
         success: true,
         post: post,
         message: '게시물이 성공적으로 수정되었습니다.',
      })
   } catch (error) {
      // console.error('서버 에러:', error)
      error.status = 500
      error.message = '게시물 수정 중 오류가 발생했습니다.'
      next(error)
   }
})

//게시글 삭제 localhost:8000/post/:id
router.delete('/:id', isLoggedIn, async (req, res, next) => {
   try {
      const post = await Board.findOne({
         where: { id: req.params.id, memberId: req.user.id },
      })
      if (!post) {
         const error = new Error('게시물을 찾을 수 없습니다.')
         error.status = 404
         return next(error)
      }
      await post.destroy()
      res.status(200).json({
         success: true,
         message: '게시물이 성공적으로 삭제되었습니다.',
      })
   } catch (error) {
      error.status = 500
      error.message = '게시물 삭제 중 오류가 발생했습니다.'
      next(error)
   }
})

//전체 게시물 불러오기
router.get('/', async (req, res, next) => {
   try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 5
      const offset = (page - 1) * limit // 오프셋

      //1. 게시물 레코드의 전체 갯수 가져오기
      const count = await Board.count()

      // 2.게시물 레코드 가져오기
      const posts = await Board.findAll({
         limit,
         offset,
         order: [['createdAt', 'DESC']], //게시물 최신날짜순으로 가져오려고
         include: [
            {
               model: Member,
               attributes: ['id', 'name', 'email'],
            },
         ],
      })
      console.log('Posts: ', posts)

      res.status(200).json({
         success: true,
         posts,
         pagination: {
            totalPosts: count, // 전체 게시물 수
            currentPage: page, // 현재 페이지
            totalPages: Math.ceil(count / limit), // 총 페이지 수
            limit, // 페이지당 게시물 수
         },
         message: '전체 게시물 리스트를 성공적으로 불러왔습니다.',
      })
   } catch (error) {
      error.status = 500
      error.message = '게시물 리스트를 불러오는 중 오류가 발생했습니다.'
      next(error)
   }
})

//특정 게시물 불러오기
router.get('/:id', async (req, res, next) => {
   try {
      const post = await Board.findByPk(req.params.id, {
         include: [
            {
               model: Member,
               attributes: ['id', 'name', 'email'],
            },
         ],
      })

      if (!post) {
         const error = new Error('게시물을 찾을 수 없습니다.')
         error.status = 404
         return next(error)
      }

      res.status(200).json({
         success: true,
         post,
         message: '게시물을 성공적으로 불러왔습니다.',
      })
   } catch (error) {
      console.error('게시물 조회 오류:', error)
      error.status = 500
      error.message = '게시물을 불러오는 중 오류가 발생했습니다.'
      next(error)
   }
})
module.exports = router
