const express = require("express");
const router = express.Router();
const path = require("path");
const reset = require('../controllers/resetpass');

router.get('/:token',(req,res)=>{
  const token = req.params.token;
  res.render("resetpass.ejs",{token:token});
})

router.post('/',reset);


module.exports = router;