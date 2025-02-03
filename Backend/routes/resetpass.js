import express from "express";
const router = express.Router();
import path from "path";
import reset from '../controllers/resetpass.js';

router.get('/:token',(req,res)=>{
  const token = req.params.token;
  res.render("resetpass.ejs",{token:token});
})

router.post('/',reset);


export default router;