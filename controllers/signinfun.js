const User = require("../models/User");
const {hash,compare} = require("../utils/hash");
const {createCookie,checkCookie} = require("../utils/cookiemaker")

async function signin(req, res)  {
  try{
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(400).send(`<script>
      alert("User does not exist - Incorrect username")
      window.location.href = "/signin"
      </script>`);
  } else{
    const comp = await compare(password,user.password);
    if (comp===false) {
      res.status(400).end(`<script>
        alert("Incorrect Password")
        window.location.href = "/signin"
        </script>`);
  }  else {
    createCookie(user,res)
    res.redirect("/");
  }
}
}catch{
  res.status(500).send(`<script>
    alert("An error occured - Please try again")
    window.location.href = "/signin"
    </script>`)
}
}
module.exports = signin;