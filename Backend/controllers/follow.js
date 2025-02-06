import User from "../models/User.js";

async function follow(req, res) {
  try {
    const { followerId, followedId } = req.body;
    if(followerId === followedId)
      {
        return res.status(400).json({message:"Cannot follow self"})
      }
    const [follower, followedUser] = await Promise.all([
      User.findOne({ username: followerId }),
      User.findOne({ username: followedId }),
    ]);
    if (!followedUser || !follower) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (followedUser.privacy === "public") {
      //check privacy status
      if (!follower.following.some((id) => id.equals(followedUser._id))) {
        //if follower does not follow the account
        follower.following.push(followedUser._id);
        followedUser.followers.push(follower._id);
        await Promise.all([follower.save(), followedUser.save()]);
        return res
          .status(200)
          .json({ message: `Started following ${followedUser.username}` });
      } else {
        return res
          .status(400)
          .json({
            message: "Cannot follow as you are already following this account",
          });
      }
    } else {
      if (!followedUser.followRequests.some((id) => id.equals(follower._id)))
        followedUser.followRequests.push(follower._id);
      await followedUser.save();
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
