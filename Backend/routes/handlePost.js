import express from 'express'
import upload from '../utils/multer.js'
import authenticate from "../middlewares/auth.js"
import createPost from '../controllers/post.js';
import getPosts from '../controllers/getPosts.js';
import getAllPosts from '../controllers/getAllPosts.js';
import deletePost from '../controllers/deletePost.js';
import likeDislike from '../controllers/likeDislike.js';
import comment from '../controllers/comment.js';
import bookMark from '../controllers/bookMark.js';
import deleteComment from '../controllers/deleteComment.js';

const router = express.Router();

router.post('/GetPosts', authenticate, getPosts);
router.post('/AllPosts', getAllPosts)
router.post('/Post', authenticate, upload.single("image"), createPost);
router.post('/DeletePost', authenticate, deletePost);
router.post('/React', authenticate, likeDislike);
router.post('/Comment', authenticate, comment);
router.post('/BookMark', authenticate, bookMark);
router.post('/DeleteComment', authenticate, deleteComment);

export default router;
