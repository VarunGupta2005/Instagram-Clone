import Post from "../../models/Post.js";
import User from "../../models/User.js"; // You must import the User model

async function getAllPosts(req, res) {
  try {
    // 1. Get the username of the person making the request.
    const { username } = req;
    if (!username) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No username provided",
      });
    }

    // 2. Find the current user's document to get their ID and who they are following.
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Create a list of user IDs whose private posts we are allowed to see.
    // This includes the people the user follows AND the user themselves.
    const authorsToInclude = [...currentUser.following, currentUser._id];

    // 4. Use an Aggregation Pipeline to fetch and filter posts.
    let posts = await Post.aggregate([
      // Stage 1: Perform a "left join" to get the author's details from the 'users' collection.
      {
        $lookup: {
          from: "users", // The actual name of the collection in MongoDB
          localField: "author",
          foreignField: "_id",
          as: "authorInfo",
        },
      },

      // Stage 2: $lookup creates an array. Deconstruct it to get a single author object.
      {
        $unwind: "$authorInfo",
      },

      // Stage 3: Filter the posts based on the author's privacy settings.
      {
        $match: {
          $or: [
            // Condition A: The author's account is public.
            { "authorInfo.privacy": "Public" },
            // Condition B: The author is private, but we follow them (or it's us).
            { "authorInfo._id": { $in: authorsToInclude } },
          ],
        },
      },

      // Stage 4: Sort the results by creation date, newest first.
      {
        $sort: { createdAt: -1 },
      },

      // Stage 5 (Optional but Recommended): Reshape the output to look like your original populate
      {
        $project: {
          caption: 1,
          image: 1,
          likes: 1,
          numComments: { $size: "$comments" },
          createdAt: 1,
          updatedAt: 1,
          // We manually structure the author object to match the old populate
          author: {
            _id: "$authorInfo._id",
            username: "$authorInfo.username",
            profilePicture: "$authorInfo.profilePicture"
          }
        }
      }
    ]);

    // 5. Populate the comments for the filtered posts.
    // You cannot chain .populate() to .aggregate(), so you use the static Model.populate() method.
    // posts = await User.populate(posts, {
    //   path: "comments",
    //   options: { sort: { createdAt: -1 } },
    //   populate: {
    //     path: "author",
    //     select: "username profilePicture"
    //   }
    // });

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts: posts,
    });

  } catch (error) {
    console.error("Error fetching feed:", error); // Log the actual error for debugging
    return res.status(500).json({
      success: false,
      message: "Could not fetch posts",
      error: error.message || "An unexpected error occurred",
    });
  }
}

export default getAllPosts;