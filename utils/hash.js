const bcrypt = require("bcryptjs");

async function hash(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  } catch {
    console.log("Error hashing");
    return null;
  }
}

async function compare(password,hashed)
{
  try{
    const comp = await bcrypt.compare(password,hashed);
    return comp;
  }
  catch{
    return false;
  }
}

module.exports = {
  hash,
  compare
}
