import express from 'express'
import unfollow from '../controllers/unfollow.js'
import authenticate from "../middlewares/auth.js"


const router = express.Router();

router.patch('/',authenticate,unfollow);

export default router;