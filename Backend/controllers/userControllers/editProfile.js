import getDataUri from "../../utils/dataUri.js";
import upload from "../../utils/cloudinary.js";
import User from "../../models/User.js";

//can add the use of cookie to validate the editProfile request
async function editProfile(req, res) {
  try {
    const username = req.username;
    const { bio, gender, privacy } = req.body;
    const profilePicture = req.file;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (privacy) user.privacy = privacy;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      const cloudResponse = await upload(fileUri);
      if (!cloudResponse) {
        return res.status(500).json({ success: false, message: "Failed to upload profile picture" });
      }
      user.profilePicture = cloudResponse.secure_url;
    }
    await user.save();
    res.status(200).json({
      success: true, message: "Profile updated successfully",
      profile: {
        bio: user.bio,
        gender: user.gender,
        privacy: user.privacy,
        profilePicture: user.profilePicture,
      }
    });
  } catch (err) {
    console.log(err);
  }
}

export default editProfile;
