import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"
import PostRoutes from "./routes/handlePost.js"
import { app, server } from './socket/socket.js'

const port = 3000;
dotenv.config();

app.use(express.static("./public"));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ChatApp").then(() => {
  console.log("Mongodb connected");
});

app.use("/user", userRoutes);
app.use("/userPost", PostRoutes);
app.use((err, req, res, next) => {
  res.send("Oki");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
