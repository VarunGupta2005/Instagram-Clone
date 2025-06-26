import User from "../../models/User.js";


async function signin(req, res) {
  try {
    const username = req.username;
    const reduxUser = req.body;
    if (username !== reduxUser.username) {
      return res.status(401).json({
        success: false,
      });
    }
    const user = await User.findOne({ username: username }).select("username _id email profilePicture bio following gender privacy bookmarks")
    if (user) {
      res.status(200).json({
        success: true,
        user: user
      })
    }
    else {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
export default signin;
