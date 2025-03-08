import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.JWT_SECRET_KEY;

// returns user if cookie is valid else returns null
function checkCookie(req) {
  const cookie = req.cookies.ChatAppCookie;
  if (cookie) {
    try {
      const token = jwt.verify(cookie, key);
      return token;
    } catch {
      return null;
    }
  } else {
    return null;
  }
}

export { checkCookie };
