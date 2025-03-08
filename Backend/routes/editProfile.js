import express from 'express'
import editProfile from '../controllers/editProfile.js'
const router = express.Router();
router.post('/',editProfile);

export default router;