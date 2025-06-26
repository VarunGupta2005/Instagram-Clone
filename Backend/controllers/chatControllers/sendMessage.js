//
// File: controllers/messages/sendMessage.js (or wherever your controller is)
//

import Message from '../../models/Message.js';
import Conversation from '../../models/Conversation.js';
import User from '../../models/User.js';
// 1. IMPORT THE 'io' INSTANCE AND THE HELPER FUNCTION
import { io, getReceiverSocketId } from '../../socket/socket.js';

export default async (req, res) => {
  try {
    const senderUsername = req.username; // Assuming 'req.username' comes from auth middleware
    const { text, conversationId } = req.body;

    // Ensure we have a valid conversationId
    if (!conversationId) {
      return res.status(400).json({ success: false, message: "Conversation ID is required." });
    }

    // Find the sender's user document to get their _id
    const sender = await User.findOne({ username: senderUsername }).select("_id").lean();
    if (!sender) {
      return res.status(404).json({ success: false, message: "Sender not found." });
    }

    // --- DATABASE OPERATIONS ---

    // 1. Create the new message document
    const newMessage = await Message.create({
      conversationId: conversationId,
      senderId: sender._id,
      message: text
    });

    // 2. Find the conversation and push the new message's ID into it
    // We also retrieve the conversation to get the participants for the real-time part.
    // Using .lean() here because we only need to read the data.
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $push: { messages: newMessage._id } },
      { new: true } // This option returns the document after the update
    );

    if (!conversation) {
      // This case would be rare since we just updated it, but it's good practice
      return res.status(404).json({ success: false, message: "Conversation not found after update." });
    }

    // --- REAL-TIME LOGIC USING SOCKET.IO ---

    // 3. Identify all recipients in the conversation (everyone except the sender)
    const recipients = conversation.participants.filter(
      participantId => !participantId.equals(sender._id)
    );

    // 4. Loop through the recipients and emit the message to each one if they are online
    recipients.forEach(recipientId => {
      // Get the socket ID from the map using the recipient's user ID
      const recipientSocketId = getReceiverSocketId(recipientId.toString());

      if (recipientSocketId) {
        // If the recipient is online (a socket ID was found), send them the new message
        // The event name 'newMessage' is a good convention.
        // Sending the full 'newMessage' object is best practice so the client has all the info.
        io.to(recipientSocketId).emit('newMessage', newMessage);
      }
    });

    // Finally, send a success response to the person who sent the message.
    // Returning the newly created message is a common and useful pattern.
    return res.status(201).json({ success: true, text: newMessage, message: "Message sent successfully" });

  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    return res.status(500).json({ success: false, message: "An error occurred while sending the message." });
  }
}