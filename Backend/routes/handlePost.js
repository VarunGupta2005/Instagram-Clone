import express from 'express'
import upload from '../utils/multer.js'
import authenticate from "../middlewares/auth.js"
import createPost from '../controllers/postControllers/post.js';
import getPosts from '../controllers/postControllers/getPosts.js';
import getAllPosts from '../controllers/postControllers/getAllPosts.js';
import deletePost from '../controllers/postControllers/deletePost.js';
import likeDislike from '../controllers/postControllers/likeDislike.js';
import comment from '../controllers/postControllers/comment.js';
import bookMark from '../controllers/postControllers/bookMark.js';
import deleteComment from '../controllers/postControllers/deleteComment.js';
import getPostComments from '../controllers/postControllers/getComments.js';


const router = express.Router();

router.post('/GetPosts', authenticate, getPosts);
router.get('/AllPosts', authenticate, getAllPosts)
router.post('/Post', authenticate, upload.single("image"), createPost);
router.post('/DeletePost', authenticate, deletePost);
router.post('/React', authenticate, likeDislike);
router.post('/Comment', authenticate, comment);
router.post('/BookMark', authenticate, bookMark);
router.post('/DeleteComment', authenticate, deleteComment);
router.post('/Comments', authenticate, getPostComments);

export default router;
