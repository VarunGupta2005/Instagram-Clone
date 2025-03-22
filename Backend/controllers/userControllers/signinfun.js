import User from "../../models/User.js";
import { hash, compare } from "../../utils/hash.js";

async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).send(`<script>
      alert("User does not exist - Incorrect email")
      window.location.href = "/signin"
      </script>`);
    } else {
      const comp = await compare(password, user.password);
      if (comp === false) {
        res.status(401).end(`<script>
        alert("Incorrect Password")
        window.location.href = "/signin"
        </script>`);
      } else {
        req.body = user;
        next();
      }
    }
  } catch {
    res.status(500).send(`<script>
    alert("An error occured - Please try again")
    window.location.href = "/signin"
    </script>`);
  }
}
export default signin;
