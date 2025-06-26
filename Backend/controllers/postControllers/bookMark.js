import User from "../../models/User.js";
import Post from "../../models/Post.js";

export default async function bookMark(req, res) {
  try {
    const user = req.username;
    const { postId } = req.body;
    const post = await Post.findById(postId).select("_id");
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    const author = await User.findOne({ username: user }).select("bookmarks");
    if (author.bookmarks.some(id => id.equals(postId))) {
      await author.updateOne({ $pull: { bookmarks: postId } });
      return res.status(200).json({ success: true, message: "Post removed from bookmarks" });
    }
    await author.updateOne({ $push: { bookmarks: postId } });
    return res.status(200).json({ success: true, message: "Post bookmarked successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "An error occurred while bookmarking the post" });
  }
}