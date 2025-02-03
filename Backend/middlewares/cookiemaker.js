import jwt from "jsonwebtoken"
const key = "$34333@###"

function createCookie(req,res,next){
const User = req.body;
const token = jwt.sign({
  username : User.username,
  email : User.email
},key,{expiresIn: "1d"});
res.cookie("ChatAppCookie", token,{maxAge:1*24*60*60*1000});
res.redirect("/");
}


export {createCookie}