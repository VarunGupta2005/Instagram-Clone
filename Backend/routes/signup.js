import express from "express"
import path from "path"
const router = express.Router();
import {createCookie} from '../middlewares/cookiemaker.js';
import { fileURLToPath } from "url"; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import signup from '../controllers/signupfun.js'

router.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'../static/signup.html'))
})

router.post('/',signup,createCookie);

export default router;