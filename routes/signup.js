const express = require("express")
const path = require("path")
const router = express.Router();
const signup = require('../controllers/signupfun')

router.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'../static/signup.html'))
})

router.post('/',signup)

module.exports = router;