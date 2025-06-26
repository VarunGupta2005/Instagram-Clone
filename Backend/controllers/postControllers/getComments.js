import Comment from "../../models/Comment.js";
import User from "../../models/User.js";

async function getPostComments(req, res) {
  try {
    const { postId } = req.body;
    const username = req.username;

    // Find the signed-in user's ObjectId
    const user = await User.findOne({ username }).select("_id");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch comments by the signed-in user
    const userComments = await Comment.find({
      post: postId,
      author: user._id,
    })
      .populate({ path: "author", select: "username profilePicture" })
      .sort({ createdAt: -1 });

    // Fetch comments by other users
    const otherComments = await Comment.find({
      post: postId,
      author: { $ne: user._id },
    })
      .populate({ path: "author", select: "username profilePicture" })
      .sort({ createdAt: -1 });

    const allComments = [...userComments, ...otherComments];

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments: allComments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch comments",
      comments: [],
    });
  }
}

export default getPostComments;
