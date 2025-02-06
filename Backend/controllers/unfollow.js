import User from "../models/User.js";

export default async function unfollow(req, res) {
  try {
    const { followerId, followedId } = req.body;
    if (followerId === followedId) {
      return res.status(400).json({ message: "Cannot unfollow self" });
    }
    const [follower, followed] = await Promise.all([
      User.findOne({ username: followerId }),
      User.findOne({ username: followedId }),
    ]);
    if (!follower || !followed) {
      return res.status(404).json({ message: "Not found" });
    }
    if (follower.following.some((id) => id.equals(followed._id))) {
      // check in followers following list for the followed user
      follower.following = follower.following.filter(
        (id) => !id.equals(followed._id)
      ); // remove from followers following
      followed.followers = followed.followers.filter(
        (id) => !id.equals(follower._id)
      ); // remove from followed accounts followers
      await Promise.all([follower.save(), followed.save()]);
      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      res.status(400).json({ message: "Not followed" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Could not unfollow" });
  }
}
