import express from "express";
import path from "path";
import User from "../models/User.js";
import checkMail from '../middlewares/emailAuth.js';
import sendMail from '../middlewares/mail.js';
import { fileURLToPath } from "url"; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();


router.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'../static/forgotpass.html'))
})
router.post('/',checkMail,sendMail,(req,res)=>{
  res.render('../views/forgotpass.ejs',{email:req.body.email});
});
export default router;