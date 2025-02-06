import express from 'express'
import follow from '../controllers/follow.js'
const router = express.Router();

router.get('/',follow);

export default router;