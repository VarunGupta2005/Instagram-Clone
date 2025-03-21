import Post from "../models/Post.js";
import User from "../models/User.js";

async function likeDislike(req, res) {
  try {
    const user = req.username;
    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    const poster = await User.findById(post.author);
    if (!poster) {
      return res.status(404).send("User not found");
    }
    const liker = await User.findOne({ username: user });
    let status = false;
    if (poster.privacy === "private") {
      if (poster.followers.some(id => id.equals(liker._id))) {
        if (post.likes.some(id => id.equals(liker._id))) {
          post.likes = post.likes.filter(id => !id.equals(liker._id));
        }
        else {
          post.likes.push(liker._id);
          status = true;
        }
      }
      else {
        return res.status(401).send("You cannot like this post");
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
    if (status)
      return res.status(200).send("Post Liked");
    return res.status(200).send("Post disliked");
  } catch {
    return res.status(500).send("Internal server error");
  }
}

export default likeDislike;