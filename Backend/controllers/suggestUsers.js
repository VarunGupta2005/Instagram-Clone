import User from "../models/User.js";

export default async function getSuggestedUsers(req, res) {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(404).json({ message: "no username provided" });
    const user = await User.findOne({ username: username }).select("_id");
    if (!user) {
      return res.status(400).json({ message: "no such user exists" });
    }
    const suggestUsers = await User.find({ _id: { $ne: user._id } }).select(
      "id username profilePicture bio gender privacy followers following"
    );
    return res.status(200).json({ suggestions: suggestUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting users" });
  }
}
