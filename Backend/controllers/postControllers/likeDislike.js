import Post from "../../models/Post.js";
import User from "../../models/User.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";
async function likeDislike(req, res) {
  try {
    const user = req.username;
    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    const poster = await User.findById(post.author).select("privacy username followers _id");
    if (!poster) {
      return res.status(404).json({ success: false, message: "Poster not found" });
    }
    const liker = await User.findOne({ username: user }).select("_id profilePicture username");
    let status = false;
    if (poster.privacy === "Private") {
      if (poster.followers.some(id => id.equals(liker._id)) || poster._id.equals(liker._id)) {
        if (post.likes.some(id => id.equals(liker._id))) {
          post.likes = post.likes.filter(id => !id.equals(liker._id));
        }
        else {
          post.likes.push(liker._id);
          status = true;
        }
      }
      else {
        return res.status(401).json({ success: false, message: "You need to follow this user to like their posts" });
      }
    }
    else {
      if (post.likes.some(id => id.equals(liker._id))) {
        post.likes = post.likes.filter(id => !id.equals(liker._id));
      }
      else {
        post.likes.push(liker._id);
        status = true;
      }
    }
    await post.save();

    if (status) {
      if (!poster._id.equals(liker._id)) {
        const notification = {
          status: true,
          user: liker,
          post: post._id,
        }
        const posterSocketId = getReceiverSocketId(poster._id.toString());
        io.to(posterSocketId).emit("notification", notification);
      }
      return res.status(200).json({ success: true, message: "Post liked" });
    }
    if (!poster._id.equals(liker._id)) {
      const notification = {
        status: false,
        user: liker,
        post: post._id,
      }
      const posterSocketId = getReceiverSocketId(poster._id.toString());
      io.to(posterSocketId).emit("notification", notification);
    }
    return res.status(200).json({ success: true, message: "Post disliked" });
  } catch (err) {
    console.error("Error in likeDislike:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export default likeDislike;