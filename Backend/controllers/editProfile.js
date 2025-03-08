import getDataUri from "../utils/dataUri.js";
import upload from "../utils/cloudinary.js";
import User from "../models/User.js";

//can add the use of cookie to validate the editProfile request
async function editProfile(req, res) {
  try {
    const { username, bio, gender, privacy } = req.body;
    const profilePicture = req.file;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (privacy) user.privacy = privacy;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      const cloudResponse = await upload(fileUri);
      user.profilePicture = cloudResponse.secure_url;
    }
    await user.save();
    res.status(200).send("User updated successfully");
  } catch (err) {
    console.log(err);
  }
}

export default editProfile;
