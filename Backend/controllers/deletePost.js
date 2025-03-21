import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

async function deletePost(req, res) {
  try {
    const author = req.username;
    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    const posterId = post.author;
    const user = await User.findOne({ username: author });
    if (user._id.equals(posterId)) {
      await Post.findByIdAndDelete(postId);
      user.posts = user.posts.filter(id => !id.equals(postId));
      await user.save();
      await Comment.deleteMany({ post: postId });
      return res.status(200).send("Post deleted successfully");
    }
    else
      return res.status(403).send("Unauthorized");
  } catch {
    return res.status(500).send("Could not delete post");
  }
}

export default deletePost;