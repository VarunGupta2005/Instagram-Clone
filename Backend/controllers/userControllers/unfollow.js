import User from "../../models/User.js";

export default async function unfollow(req, res) {
  try {
    const followerId = req.username;
    const { followedId } = req.body;
    if (followerId === followedId) {
      return res.status(400).json({ message: "Cannot unfollow self" });
    }
    const [follower, followed] = await Promise.all([
      User.findOne({ username: followerId }).select("_id following"),
      User.findOne({ username: followedId }).select("_id"),
    ]);
    if (!follower || !followed) {
      return res.status(404).json({ message: "Not found" });
    }
    if (follower.following.some((id) => id.equals(followed._id))) {
      await Promise.all([
        User.updateOne(
          { _id: follower._id },
          { $pull: { following: followed._id } }
        ),
        User.updateOne(
          { _id: followed._id },
          { $pull: { followers: follower._id } }
        ),
      ]);
      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      res.status(400).json({ message: "Not followed" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Could not unfollow" });
  }
}
