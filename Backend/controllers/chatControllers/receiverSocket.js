export default async function receiverSocket(req, res) {
  try {
    const { receiverId } = req.body;
    if (!receiverId) {
      return res.status(400).json({ success: false, message: "Receiver ID is required" });
    }

  } catch (error) {
    console.error("Error in receiverSocket:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

}