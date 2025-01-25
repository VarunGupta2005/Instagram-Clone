const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/User");
const checkMail = require('../middlewares/emailAuth');
const sendMail = require('../middlewares/mail');
router.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'../static/forgotpass.html'))
})
router.post('/',checkMail,sendMail,(req,res)=>{
  res.render('../views/forgotpass.ejs',{email:req.body.email});
});
module.exports = router;