import User from "../../models/User.js";
import { hash, compare } from "../../utils/hash.js";

async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ success: false, message: "User does not exist" });
    } else {
      const comp = await compare(password, user.password);
      if (comp === false) {
        res.status(401).json({ success: false, message: "Incorrect password" });
      } else {
        req.body = user;
        next();
      }
    }
  } catch {
    res.status(500).json({ success: false, message: "Error in signing in" });
  }
}
export default signin;
