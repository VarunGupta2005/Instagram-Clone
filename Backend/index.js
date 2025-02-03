import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";

// Import route modules using ESM syntax
import signup from "./routes/signup.js";
import signin from "./routes/signin.js";
import home from "./routes/home.js";
import forgot from "./routes/forgotpass.js";
import reset from "./routes/resetpass.js";
import dotenv from 'dotenv';

const app = express();
const port = 3000;
dotenv.config();

app.use(express.static('./public'))
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

mongoose.connect("mongodb://127.0.0.1:27017/ChatApp")
.then(()=>{
  console.log("Mongodb connected")
})


app.use('/signup',signup)
app.use('/',home)
app.use('/signin',signin)
app.use('/forgot',forgot);
app.use('/reset-password',reset)
app.use((err,req,res,next)=>{
  res.send("Oki")
})

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`)
})