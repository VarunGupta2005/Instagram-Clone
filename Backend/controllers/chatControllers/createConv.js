import User from "../../models/User.js";
import Conversation from "../../models/Conversation.js";

export default async (req, res) => {
  try {
    const user = req.username;
    const { receiver } = req.body;
    const creator = await User.findOne({ username: user }).select("_id");
    const other = await User.findOne({ username: receiver }).select("_id");
    if (!other) {
      return res.status(404).json({ success: false, message: "Receiver not found" });
    };
    const timestamp = new Date();
    const participantIds = [creator._id, other._id];
    const conversation = new Conversation({
      participants: [creator._id, other._id],
      isGroup: false,
      groupName: null,
    })
    await conversation.save();
    const conId = conversation._id;
    await User.updateMany({ _id: { $in: participantIds } }, { $push: { conversations: { conversationId: conId, timeWindow: [{ start: timestamp }] } } });
    return res.status(200).json({ success: true, message: "Group created", conversationId: conId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Could not create conversation" });
  }
}