import User from "../../models/User.js";
import Comment from "../../models/Comment.js";
import Post from "../../models/Post.js";

export default async function deleteComment(req, res) {
  try {
    const author = req.username;
    const { commentId } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(404).send("Comment not found");
    const user = await User.findOne({ username: author });
    if (user._id.equals(comment.author)) {
      const postId = comment.post;
      await comment.deleteOne();
      await Post.updateOne({ _id: postId }, { $pull: { comments: commentId } });
      return res.status(200).send("Comment deleted successfully");
    }
    else
      return res.status(403).send("Unauthorized");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Could not delete comment");
  }
}