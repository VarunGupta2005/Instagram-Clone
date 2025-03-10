import User from "../models/User.js";

async function follow(req, res) {
  try {
    const followerId = req.username;
    const { followedId } = req.body;
    if (followerId === followedId) {
      return res.status(400).json({ message: "Cannot follow self" });
    }
    const [follower, followedUser] = await Promise.all([
      User.findOne({ username: followerId }).select("_id following"),
      User.findOne({ username: followedId }).select(
        "_id privacy followRequests"
      ),
    ]);

    if (!followedUser || !follower) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (followedUser.privacy === "public") {
      //check privacy status
      if (!follower.following.some((id) => id.equals(followedUser._id))) {
        //if follower does not follow the account
        await Promise.all([
          User.updateOne(
            { _id: follower._id },
            { $push: { following: followedUser._id } }
          ),
          User.updateOne(
            { _id: followedUser._id },
            { $push: { followers: follower._id } }
          ),
        ]);
        return res
          .status(200)
          .json({ message: `Started following ${followedId}` });
      } else {
        return res.status(400).json({
          message: "Cannot follow as you are already following this account",
        });
      }
    } else {
      await User.updateOne(
        { _id: followedUser._id },
        { $addToSet: { followRequests: follower._id } }
      );
      return res.status(200).json({ message: "Follow request sent" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error occured while processing the request" });
  }
}

export default follow;
