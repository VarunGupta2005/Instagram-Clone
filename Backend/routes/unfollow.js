import express from 'express'
import unfollow from '../controllers/unfollow.js'
const router = express.Router();

router.get('/',unfollow);

export default router;