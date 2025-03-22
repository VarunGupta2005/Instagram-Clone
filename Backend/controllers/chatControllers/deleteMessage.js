import Message from "../../models/Message.js";
import User from "../../models/User.js";
import Conversation from "../../models/Conversation.js";

export const deleteMessage = async (req, res) => {
  try {
    const { messageId, conversationId } = req.body;
    const username = req.username;

    // Check if the user is the sender
    const [message, user, conversation] = await Promise.all([Message.findById(messageId), User.findOne({ username: username }), Conversation.findById(conversationId)]);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (!message.senderId.equals(user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!conversation.messages.includes(messageId))
      return res.status(400).json({ message: "Message not part of this conversation" })

    await Promise.all([Conversation.findByIdAndUpdate(conversationId, { $pull: { messages: messageId } }), Message.findByIdAndDelete(messageId)])

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not delete message" });
  }
};
