const express = require("express")
const app = express()
const port = 3000
const mongoose= require('mongoose')
const signup = require('./routes/signup')
const cors = require("cors")

app.use(cors())
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb://127.0.0.1:27017/ChatApp")
.then(()=>{
  console.log("Mongodb connected")
})


app.use('/signup',signup)
app.use('/Chat',)


app.listen(port,()=>{
  console.log(`Server is running on port ${port}`)
})