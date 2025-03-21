import User from "../models/User";
import Conversation from "../models/Conversation";

export const startConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    const sender = req.username;

    // Fetch users
    const [senderUser, recipientUser] = await Promise.all([
      User.findOne({ username: sender }).select("_id conversations"),
      User.findById(recipientId).select("_id conversations"),
    ]);

    if (!senderUser || !recipientUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a conversation already exists
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [senderUser._id, recipientUser._id] },
    });
    const time = new Date();
    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [senderUser._id, recipientUser._id],
        messages: [],
        isGroup: false,
      });

      await conversation.save();
      // Update conversations in both users

      senderUser.conversations.push({ conversationId: conversation._id, timeWindow: [{ start: time }] });
      recipientUser.conversations.push({ conversationId: conversation._id, timeWindow: [{ start: time }] });

      await Promise.all([senderUser.save(), recipientUser.save()]);
    }
    else {
      // if sender has removed the conversation from inbox
      const index = senderUser.conversations.findIndex(c => c.conversationId.equals(conversation._id));
      if (index === -1) {
        senderUser.conversations.push({ conversationId: conversation._id, timeWindow: [{ start: time }] });
        await senderUser.save();
      }
      // if recipient has removed the conversation from inbox
      const index2 = recipientUser.conversations.findIndex(c => c.conversationId.equals(conversation._id));
      if (index2 === -1) {
        recipientUser.conversations.push({ conversationId: conversation._id, timeWindow: [{ start: time }] });
        await recipientUser.save();
      }
    }
    req.conversationId = conversation._id;
    next();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Could not start conversation" });
  }
};
