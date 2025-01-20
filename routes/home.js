const express = require("express")
const router = express.Router();
const {createCookie,checkCookie} = require("../utils/cookiemaker")

router.get('/',(req,res)=>
{
  const user = checkCookie(req);
  res.render("../views/home.ejs",{user: user})
})

module.exports = router;