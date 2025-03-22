import Comment from "../../models/Comment.js";

async function getPostComments(req, res) {
  try {
    const { postId } = req.body;
    const comments = await Comment.find({ post: postId }).populate({ path: "author", select: "username profilePicture" });
    return res.status(200).send(comments);
  }
  catch {
    return res.status(500).send("Could not fetch comments");
  }
}

export default getPostComments;