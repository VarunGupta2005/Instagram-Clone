import express from 'express'
import follow from '../controllers/follow.js'
import authenticate from "../middlewares/auth.js"
const router = express.Router();

router.patch('/',authenticate,follow);

export default router;