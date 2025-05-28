async function signout(req, res) {
  try {
    res.clearCookie("ChatAppCookie");
    res.status(200).json({ success: true, message: "Signed out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
export default signout;
