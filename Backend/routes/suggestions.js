import express from 'express'
import getSuggestedUsers from '../controllers/suggestUsers.js'

const router = express.Router();
router.get('/',getSuggestedUsers);

export default router;