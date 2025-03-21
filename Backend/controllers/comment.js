import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

async function comment(req, res) {
  try {
    const author = req.username;
    const { postId, text } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    if (!text) {
      return res.status(400).send("Text is required");
    }
    const posterId = post.author;
    const [poster, user] = await Promise.all([User.findById(posterId), User.findOne({ username: author })])
    if (poster.privacy === "private") {
      if (!poster.followers.some(id => id.equals(user._id))) return res.status(400).send("Cannot comment on private post");
    }
    const comment = await new Comment({
      text,
      author: user._id,
      post: postId,
    }).populate({ path: "author", select: "username profilePicture" });
    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    return res.status(200).send(`Comment, ${text}, added to post successfully`);
  } catch {
    return res.status(500).send("Could not comment");
  }
}

export default comment;