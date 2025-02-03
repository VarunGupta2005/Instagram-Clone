import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { hash } from "../utils/hash.js";

async function reset(req, res) {
  const { token, password, confirmPassword } = req.body;

  // Can be done on frontend?
  if (password !== confirmPassword) {
    return res.status(401).send("Passwords do not match");
  }

  try {
    // Decode the token and get the email and resetTokenVersion
    const decoded = jwt.verify(token, process.env.RESET_SECRET_KEY);
    const email = decoded.email;
    const resetTokenVersion = decoded.resetTokenVersion;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the token version in the token is the same as the one in the database to prevent reusing the token
    const userTokenVersion = user.resetTokenVersion;
    if (userTokenVersion + 1 !== resetTokenVersion) {
      return res.status(400).send("Invalid token");
    }

    // Hash the new password and save it to the database
    const hashedPassword = await hash(password);
    user.resetTokenVersion = resetTokenVersion;
    user.password = hashedPassword;
    await user.save();
    res.status(200).send("Password has been reset successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("Could not change password");
  }
}

export default reset;
