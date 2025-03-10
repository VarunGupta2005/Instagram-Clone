import User from "../models/User.js";

async function getProfile(req, res) {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username: username });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
}

export default getProfile;
