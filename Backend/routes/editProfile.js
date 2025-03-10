import express from 'express'
import editProfile from '../controllers/editProfile.js'
import upload from '../utils/multer.js'
import authenticate from "../middlewares/auth.js"


const router = express.Router();
router.post('/',authenticate,upload.single("ProfilePicture"),editProfile);

export default router;