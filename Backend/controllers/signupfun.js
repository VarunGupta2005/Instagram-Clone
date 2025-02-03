import User from "../models/User.js";
import { hash, compare } from "../utils/hash.js";

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
      res.status(401).send(
        `<script>
      alert("User already exists - Username or email already in use");
      window.location.href = "/signup";
      </script>`
      );
    } else {
      res.status(500).send(
        `<script>
      alert("An error occured. Please try again");
      window.location.href = "/signup";
      </script>`
      );
    }
  }
}

export default signup;
