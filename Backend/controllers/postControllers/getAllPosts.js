import Post from "../../models/Post.js";

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
      .populate({ path: "author", select: ' username profilePicture' })
      .populate({
        path: "comments", sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture"
        }
      }
      )
    return res.status(200).send(posts);
  } catch {
    return res.status(500).send("Internal server error");
  }
}

export default getAllPosts;