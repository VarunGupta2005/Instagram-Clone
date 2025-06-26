import Post from "../../models/Post.js";
import Comment from "../../models/Comment.js";
import User from "../../models/User.js";

async function comment(req, res) {
  try {
    const author = req.username;
    const { postId, text } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    if (!text) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }
    const posterId = post.author;
    const [poster, user] = await Promise.all([User.findById(posterId), User.findOne({ username: author })])
    if (poster.privacy === "Private") {
      if (!poster.followers.some(id => id.equals(user._id))) return res.status(400).json({
        success: false,
        message: "You cannot comment on this post as the author has a private account and you are not following them."
      });
    }
    const comment = await new Comment({
      text,
      author: user._id,
      post: postId,
    }).populate({ path: "author", select: "username profilePicture" });
    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the comment",
    });
  }
}

export default comment;