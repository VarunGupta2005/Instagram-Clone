const express = require("express")
const jwt = require("jsonwebtoken")
const key = "$34333@###"

function createCookie(User,res){
const token = jwt.sign({
  username : User.username,
  email : User.email
},key);
res.cookie("ChatAppCookie", token);
}

function checkCookie(req){
  const cookie = req.cookies.ChatAppCookie;
  if(cookie){
    try{
     const token = jwt.verify(cookie,key);
     return token
  }
  catch{
    return null;
  }
}
  else
  {
    return null;
  }
}

module.exports = {
  createCookie,
  checkCookie
};