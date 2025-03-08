import express from 'express'
import follow from '../controllers/follow.js'
const router = express.Router();

router.patch('/',follow);

export default router;