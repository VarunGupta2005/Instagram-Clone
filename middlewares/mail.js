const nodemailer = require("nodemailer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "mlrccntmail@gmail.com",
    pass: "adge ezmu sjxi eekc",
  },
});




async function sendMail(transporter,mailOptions,next){
  try{
    await transporter.sendMail(mailOptions);
    next();
  }catch(err){
    console.log(err)
  }
}


async function Mail(req,res,next){
  try{
  const email = req.body.email;
  const user = await User.findOne({email:email});
  let userTokenVersion = user.resetTokenVersion;
  userTokenVersion=userTokenVersion+1;
  const token = jwt.sign({email: email,resetTokenVersion:userTokenVersion},process.env.RESET_SECRET_KEY,{expiresIn:"1h"});//token for reset password
  const link = `http://localhost:3000/reset-password/${token}`;//link to reset password page
  let mailOptions = {
    from: '"Chat App" <mlrccntmail@gmail.com>',
    to:["id47@gmail.com"], 
    subject: "Password Reset", 
    text: "You forgot your password", 
    html: `<b>Click on the link below to reset your passord</b><br><a href="${link}">Click Here</a>`,
}
  mailOptions.to = req.body.email;
  sendMail(transporter,mailOptions,next);
}catch(err){console.log(err)}
}

module.exports = Mail;