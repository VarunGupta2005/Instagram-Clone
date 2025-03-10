import express from 'express'
import remove from '../controllers/removefollower.js'
import authenticate from "../middlewares/auth.js"
const router = express.Router();

router.patch('/',authenticate,remove);

export default router;