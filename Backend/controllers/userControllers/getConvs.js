import User from "../../models/User.js";

async function getCons(req, res) {
  const username = req.username;
  try {
    const user = await User.findOne({ username: username })
      .select("conversations")
      .populate({
        // CORRECTED PATH: Target the 'conversationId' field within the 'conversations' array
        path: "conversations.conversationId",
        model: "Conversation", // It's good practice to explicitly state the model in deep populates
        select: "participants isGroup groupName", // Select fields from the Conversation model
        populate: {
          // Further populate the 'participants' field within the Conversation document
          path: "participants",
          model: "User",
          select: "username profilePicture _id"
        }
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Now, the response data will have the nested structure you want
    // We'll map it to a cleaner format for the frontend.
    const formattedConversations = user.conversations.map(convObj => {
      // The populated data is inside convObj.conversationId
      // We return the entire populated conversation object
      return convObj.conversationId;
    });

    return res.status(200).json({
      success: true,
      // Send the cleaned-up array
      conversations: formattedConversations
    });

  } catch (err) {
    console.error("Error in getCons:", err);
    return res.status(500).json({ success: false, message: "An error occurred while fetching conversations" });
  }
}

export default getCons;