import Message from '../../models/Message.js';
import Conversation from '../../models/Conversation.js';
import User from '../../models/User.js';


export default async (req, res) => {
  try {
    const user = req.username;
    const { receiver, text } = req.body;
    const conversationId = req.conversationId;

    const sender = await User.findOne({ username: user }).select("_id");

    const message = await Message.create({
      conversationId: conversationId,
      senderId: sender._id,
      message: text
    })

    await Conversation.findByIdAndUpdate(conversationId, { $push: { messages: message._id } });

  } catch (error) {
    console.log(error);
    return res.status(500).send("Message not sent");
  }
}