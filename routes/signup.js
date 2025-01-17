const express = require("express")
const path = require("path")
const router = express.Router();
const User = require("../models/User")


router.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'../static/signup.html'))
})


router.post('/',async (req,res)=>{
  try{
    const {username,email,password}=req.body;
    const user = new User({username:username,email:email,password:password})
    await user.save();
    res.redirect('/')
  }
  catch{
    res.send(
      `<script>
      alert("User already exists");
      window.location.href = "/signup";
      </script>`)
  }
})

module.exports = router;