const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');



async function reset(req, res){
  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
  }

  try {
    
      const decoded = jwt.verify(token, process.env.RESET_SECRET_KEY);
      const email = decoded.email;
      const resetTokenVersion = decoded.resetTokenVersion;
      
      const user = await User.findOne({ email });
      

      if (!user) {
          return res.status(404).send("User not found");
      }
      const userTokenVersion = user.resetTokenVersion;
      if(userTokenVersion+1!==resetTokenVersion)
      {
        return res.status(400).send("Invalid token");
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.resetTokenVersion = resetTokenVersion;
      user.password = hashedPassword;
      await user.save();

      res.status(200).send("Password has been reset successfully");
  } catch (error) {
    console.log(error)
      res.status(400).send("Invalid or expired token");
  }
}

module.exports = reset;