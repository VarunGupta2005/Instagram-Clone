import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";

// Import route modules using ESM syntax
// import signup from "./routes/signup.js";
// import signin from "./routes/signin.js";
// import home from "./routes/home.js";
// import forgot from "./routes/forgotpass.js";
// import reset from "./routes/resetpass.js";
import dotenv from "dotenv";
// import follow from "./routes/follow.js";
// import unfollow from "./routes/unfollow.js";
// import handleRequest from "./routes/handleReq.js";
// import suggestions from "./routes/suggestions.js";
// import editProfile from "./routes/editProfile.js";
// import removeFollower from "./routes/removeFollower.js";
import userRoutes from "./routes/userRoutes.js"
import PostRoutes from "./routes/handlePost.js"

const app = express();
const port = 3000;
dotenv.config();

app.use(express.static("./public"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ChatApp").then(() => {
  console.log("Mongodb connected");
});

// app.use("/user/signup", signup);
// app.use("/", home);
// app.use("/user/signin", signin);
// app.use("/user/forgot", forgot);
// app.use("/user/reset-password", reset);
// app.use("/user/follow", follow);
// app.use("/user/unfollow", unfollow);
// app.use("/user/handleRequest", handleRequest);
// app.use("/user/getSuggestions", suggestions);
// app.use("/user/editProfile", editProfile);
// app.use("/user/removeFollower", removeFollower);/
app.use("/user", userRoutes);
app.use("/userPost", PostRoutes);


app.use((err, req, res, next) => {
  res.send("Oki");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
