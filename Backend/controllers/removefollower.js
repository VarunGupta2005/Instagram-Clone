import User from "../models/User.js";

export default async function unfollow(req, res) {
  try {
    const UserId = req.username;
    const { followerId } = req.body;
    if (UserId === followerId) {
      return res.status(400).json({ message: "Cannot unfollow self" });
    }
    const [user, follower] = await Promise.all([
      User.findOne({ username: UserId }).select("_id followers"),
      User.findOne({ username: followerId }).select("_id"),
    ]);
    if (!user || !follower) {
      return res.status(404).json({ message: "Not found" });
    }
    if (user.followers.some((id) => id.equals(follower._id))) {
      await Promise.all([
        User.updateOne(
          { _id: follower._id },
          { $pull: { following: user._id } }
        ),
        User.updateOne(
          { _id: user._id },
          { $pull: { followers: follower._id } }
        ),
      ]);
      return res.status(200).json({ message: "Follower removed successfully" });
    } else {
      res.status(400).json({ message: "No such follower exists" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Could not remove follower" });
  }
}
