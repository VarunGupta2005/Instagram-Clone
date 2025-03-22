import User from "../../models/User.js";
import Post from "../../models/Post.js";

export default async function bookMark(req, res) {
  try {
    const user = req.username;
    const { postId } = req.body;
    const post = await Post.findById(postId).select("_id");
    if (!post) {
      return res.status(404).send("Post not found");
    }
    const author = await User.findOne({ username: user }).select("bookmarks");
    if (author.bookmarks.some(id => id.equals(postId))) {
      await author.updateOne({ $pull: { bookmarks: postId } });
      return res.status(200).send("Post removed from bookmarks");
    }
    await author.updateOne({ $push: { bookmarks: postId } });
    return res.status(200).send("Post bookmarked");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Could not bookmark");
  }
}