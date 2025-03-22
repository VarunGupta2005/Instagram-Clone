import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

export const getMessages = async (req, res) => {
  try {
    const user = req.username;
    const { conversationId } = req.body;
    const [member, conversation] = await Promise.all([User.findOne({ username: user }).select("_id conversations"), Conversation.findById(conversationId)])

    if (!conversation) {
      return res.status(404).json({ message: "No past conversation exists", messages: [] });
    }

    if (!conversation.participants.some(part => part.equals(member._id))) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let messages = [];
    const index = member.conversations.findIndex(con => con.conversationId.equals(conversationId));
    if (index !== -1) {
      const timeWindow = member.conversations[index].timeWindow;
      const queries = timeWindow.map(({ start, end }) => ({
        conversationId: conversationId,
        createdAt: end ? { $gte: new Date(start), $lte: new Date(end) } : { $gte: new Date(start) }
      }));

      // Execute all queries in parallel for efficiency
      const results = await Promise.all(
        queries.map(query =>
          Message.find(query)
            .populate("senderId", "username profilePicture") // Populate sender details
            .select("message createdAt senderId") // Select required fields
            .sort({ createdAt: 1 })
        )
      );

      // Flatten results into a single messages array
      messages = results.flat().sort((a, b) => a.createdAt - b.createdAt);
    }
    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch messages" });
  }
};
