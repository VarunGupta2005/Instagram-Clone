import jwt from "jsonwebtoken";
const key = "$34333@###";

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
