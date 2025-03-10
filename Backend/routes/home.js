import express from "express"
import authenticate from "../middlewares/auth.js"

const router = express.Router();


router.get('/',authenticate,(req,res)=>
{
  
  res.render("../views/home.ejs",{user: req.username})
})


export default router;