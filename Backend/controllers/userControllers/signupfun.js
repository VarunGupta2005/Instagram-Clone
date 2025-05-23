import User from "../../models/User.js";
import { hash, compare } from "../../utils/hash.js";

async function signup(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hash(password);
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await user.save();
    req.body = user;
    next();
  } catch (error) {
    if (error.code === 11000) {
      res.status(401).json({ success: false, message: "User already exists" });
    } else {
      res.status(500).json({ success: false, message: "Error in creating user" });
    }
  }
}

export default signup;
