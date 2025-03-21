import Post from "../models/Post.js";
import User from "../models/User.js";

async function getPosts(req,res){
  try{
    const username = req.username;
    const user = await User.findOne({username:username});
    const posts = await Post.find({author:user._id}).sort({createdAt: -1})
    .populate({path:"author",select:"username profilePicture"})
    .populate({path:"comments",sort:{createdAt: -1}, select : "username profilePicture"});
    return res.status(200).send(posts);
  }catch{
    return res.status(500).send("Internal server error");
  }
}

export default getPosts;