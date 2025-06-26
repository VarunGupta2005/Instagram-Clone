import User from "../../models/User.js";

export default async function searchUsers(req, res) {
  try {
    // 1. Get the search query from the request's query parameters
    const { q: searchQuery } = req.query;

    // 2. Get the username of the user performing the search to exclude them from results
    const searchingUsername = req.username;

    if (!searchQuery) {
      // If no query is provided, return an empty array
      return res.status(200).json({ success: true, users: [] });
    }

    // 3. Create a case-insensitive regular expression for a partial match
    // This will find usernames that *contain* the search query
    const regex = new RegExp(searchQuery, "i");

    // 4. Find the user who is searching to get their _id
    const searchingUser = await User.findOne({ username: searchingUsername }).select("_id");
    if (!searchingUser) {
      return res.status(404).json({ success: false, message: "Searching user not found." });
    }

    // 5. Query the database
    const users = await User.find({
      username: { $regex: regex },
      _id: { $ne: searchingUser._id } // Exclude the current user from the search results
    })
      .select("username profilePicture bio _id privacy") // Only select the fields we need for the frontend

    return res.status(200).json({ success: true, users });

  } catch (err) {
    console.error("Error in searchUsers:", err);
    res.status(500).json({ success: false, message: "Server error during user search." });
  }
}