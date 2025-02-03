import express from "express"
import {checkCookie} from "../utils/Auth.js"

const router = express.Router();


router.get('/',(req,res)=>
{
  const user = checkCookie(req);
  res.render("../views/home.ejs",{user: user})
})


export default router;