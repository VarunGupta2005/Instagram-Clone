import Post from "../../models/Post.js";
import Comment from "../../models/Comment.js";
import User from "../../models/User.js";

async function deletePost(req, res) {
  try {
    const author = req.username;
    const { postId } = req.body;
    console.log(postId);
    const post = await Post.findById(postId);
    // console.log(post);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const posterId = post.author;
    const user = await User.findOne({ username: author });
    if (user._id.equals(posterId)) {
      await Post.findByIdAndDelete(postId);
      user.posts = user.posts.filter(id => !id.equals(postId));
      await user.save();
      await Comment.deleteMany({ post: postId });
      return res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    }
    else
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export default deletePost;