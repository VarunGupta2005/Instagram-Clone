import User from '../../models/User.js';
import Conversation from '../../models/Conversation.js';

const fetchConversation = async (req, res) => {
  try {
    const username = req.username;
    const { receiver } = req.body;
    const [user1, user2] = await Promise.all([User.findOne({ username: username }).select("_id"), User.findOne({ username: receiver }).select("_id")])
    if (!user1 || !user2) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const conversation = await Conversation.findOne({
      participants: { $all: [user1._id, user2._id] },
      isGroup: false
    }).select("_id")
    if (conversation)
      return res.status(200).json({
        success: true,
        conversationId: conversation._id
      });
    else
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while fetching the conversation" });
  }
}
export default fetchConversation;         