import express from 'express'
import getSuggestedUsers from '../controllers/suggestUsers.js'
import authenticate from "../middlewares/auth.js"

const router = express.Router();
router.get('/',authenticate,getSuggestedUsers);

export default router;