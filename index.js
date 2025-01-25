const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()
const port = 3000
const mongoose= require('mongoose')
const signup = require('./routes/signup')
const signin = require('./routes/signin')
const home = require("./routes/home")
const forgot = require('./routes/forgotpass')
const reset = require('./routes/resetpass')
const cors = require("cors")
require('dotenv').config()

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