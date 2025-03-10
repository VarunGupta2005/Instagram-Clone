import User from "../models/User.js";

export default async function manageReq(req, res) {
  try {
    const followedId = req.username;
    const {followerId, status } = req.body;
    if (followerId === followedId) {
      return res.status(400).json({ message: "Cannot follow/unfollow self" });
    }
    const [follower, followed] = await Promise.all([
      User.findOne({ username: followerId }).select("_id following"),
      User.findOne({ username: followedId }).select("_id followRequests followers"),
    ]);
    if (!follower || !followed)
      return res.status(400).json({ message: "Could not find such user" });
    if (followed.followRequests.some((id) => id.equals(follower._id))) {
      if (status) {
        followed.followers.push(follower._id);
        follower.following.push(followed._id);
      }
      followed.followRequests = followed.followRequests.filter(
        (id) => !id.equals(follower._id) 
      );
      await Promise.all([followed.save(), follower.save()]);
      if (status)
        return res.status(200).json({ message: "New follower added" });
      else return res.status(200).json({ message: "Declined request" });
    } else {
      return res.status(400).json({ message: "No follow request exists" });
    }
  } catch (err) {
    console.error(err);
  }
}
