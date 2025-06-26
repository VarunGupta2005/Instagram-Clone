import User from "../../models/User.js";

export default async function getSuggestedUsers(req, res) {
  try {
    const username = req.username;
    if (!username) {
      // It's better to use 401 (Unauthorized) or 403 (Forbidden) if a user is required
      return res.status(401).json({ message: "No username provided, authorization required." });
    }

    // 1. Fetch the current user AND their 'following' list.
    const user = await User.findOne({ username: username }).select("_id following");
    if (!user) {
      return res.status(404).json({ success: false, message: "No such user exists" });
    }

    // 2. Create an array of IDs to exclude: the user's own ID and all IDs they are following.
    const usersToExclude = [user._id, ...user.following];

    // 3. Find all users whose _id is "not in" the exclusion list.
    const suggestedUsers = await User.find({ _id: { $nin: usersToExclude } }).select(
      "id username profilePicture bio gender privacy followers following"
    );

    return res.status(200).json({ success: true, suggestions: suggestedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error getting suggested users" });
  }
}