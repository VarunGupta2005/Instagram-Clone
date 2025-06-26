import User from "../../models/User.js";

async function getProfile(req, res) {
  const requestedUsername = req.params.username;
  const requestingUsername = req.username;

  try {
    const requestingUser = await User.findOne({ username: requestingUsername });

    if (!requestingUser) {
      return res.status(404).json({ success: false, message: "Requesting user not found." });
    }

    // Fetch the user and populate necessary fields. We still fetch everything
    // because we need follower/following counts even for private profiles.
    const profileUser = await User.findOne({ username: requestedUsername })
      .select("-password")
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username  profilePicture"
        }
      })
      .populate({
        path: "followers",
        select: "username bio profilePicture"// Only need _id for the check
      })
      .populate({
        path: "following",
        select: "username bio profilePicture" // Only need _id for the count
      })
      .populate({
        path: "bookmarks",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username  profilePicture"
        }
      });
    if (!profileUser) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const isOwnProfile = requestingUsername === requestedUsername;
    const isFollowing = profileUser.followers.some(follower => follower._id.equals(requestingUser._id));
    const isPublic = profileUser.privacy === "Public";

    // If it's their own profile, a public profile, or a private profile they follow:
    if (isOwnProfile || isPublic || isFollowing) {
      // User is authorized to see the full profile.
      const profileObject = profileUser.toObject();

      // Add the comment count to each post
      profileObject.posts = profileObject.posts.map(post => ({
        ...post,
        noOfComments: post.comments ? post.comments.length : 0,
        isFollowing: isFollowing // Add the following status to each post
      }));

      // Send the full, modified profile object
      return res.status(200).json({ success: true, profile: profileObject });

    } else {
      // --- START OF MODIFICATION ---
      // This is a private profile and the user does NOT follow them.
      // Instead of an error, send back a limited profile object.

      const limitedProfile = {
        _id: profileUser._id,
        username: profileUser.username,
        profilePicture: profileUser.profilePicture,
        bio: profileUser.bio,
        followersCount: profileUser.followers.length,
        followingCount: profileUser.following.length,
        privacy: profileUser.privacy,
        isLocked: true, // A flag for the frontend to easily identify this state
        posts: [], // Send an empty array for posts
        numPosts: profileUser.posts.length,
        isFollowing: false // Explicitly state they are not following
      };

      return res.status(200).json({ success: true, profile: limitedProfile });
      // --- END OF MODIFICATION ---
    }

  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export default getProfile;