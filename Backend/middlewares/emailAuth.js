import User from "../models/User.js";

async function checkMail(req,res,next){
  const email = req.body.email;
  const user = await User.findOne({email:email});
  if(!user)
  {
    res.end(`<script>
      alert("No user with the given email exists")
      window.location.href="/forgot"
      </script>`)
  }
  else
  {
    next();
  }
}

export default checkMail;