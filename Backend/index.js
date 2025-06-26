import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"
import PostRoutes from "./routes/handlePost.js"
import { app, server } from './socket/socket.js'
import path from "path";

const __dirname = path.resolve();
const port = process.env.PORT;
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
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
