import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const sender = req.username;

    // Fetch sender
    const senderUser = await User.findOne({ username: sender }).select("_id");
    // Find the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    // Check if sender is a participant of the group
    if (!conversation.participants.some(id => id.equals(senderUser._id))) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const message = await Message.create({
      conversationId: conversationId,
      senderId: sender._id,
      message: text
    })

    await Conversation.findByIdAndUpdate(conversationId, { $push: { messages: message._id } });

    return res.status(200).json({ message: "Message sent to group", conversation });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Could not send message" });
  }
};
