import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.JWT_SECRET_KEY;

// adds username to request if cookie is valid else returns error
function checkCookie(req,res,next) {
  const cookie = req.cookies.ChatAppCookie;
  if (cookie) {
    try {
      const token = jwt.verify(cookie, key);
      req.username = token.username;
      next();
    } catch {
      return next(new Error("Invalid token"));
    }
  } else {
    return next(new Error("Authentication token is missing"));
  }
}

export default checkCookie;