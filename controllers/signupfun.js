const User = require("../models/User");
const { hash, compare } = require("../utils/hash");
const { createCookie, checkCookie } = require("../utils/cookiemaker");

async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hash(password);
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await user.save();
    createCookie(user, res);
    res.redirect("/");
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send(
        `<script>
      alert("User already exists - Username or email already in use");
      window.location.href = "/signup";
      </script>`
      );
    }
    else
    {
      res.status(500).send(
        `<script>
      alert("An error occured. Please try again");
      window.location.href = "/signup";
      </script>`
      );
    }
  }
}

module.exports = signup;
