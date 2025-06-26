import User from "../../models/User.js";

export default async function unfollow(req, res) {
  try {
    const UserId = req.username;
    const user = await User.findOne({ username: UserId }).select("_id followRequests").populate({
      path: "followRequests",
      select: "username profilePicture bio"
    });
    if (!user) { return res.status(404).json({ success: false, message: "User not found" }); }
    else {
      return res.status(200).json({ success: true, followRequests: user.followRequests });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Could not fetch requests" });
  }
}
