import User from "../models/User.js";
import Conversation from "../models/Conversation.js";

export default async function leaveGroup(req, res) {
  try {
    const { conversationId } = req.body;
    const user = req.username;

    const [member, conversation] = await Promise.all([User.findOne({ username: user }).select("_id conversations"), Conversation
      .findById(conversationId)
    ])


    //check if valid request
    if (!conversation || !conversation.isGroup) return res.status(404).send("Group chat not found");
    if (!conversation.participants.some(id => id.equals(member._id)))
      return res.status(403).send("User not part of the group");

    //remove participant from group
    await Conversation.findByIdAndUpdate(conversationId, { $pull: { participants: member._id } });

    //update end time in User schema of leaver
    const index = member.conversations.findIndex(con => con.conversationId.equals(conversationId));
    if (index !== -1) {
      const timeWindowLength = member.conversations[index].timeWindow.length;
      member.conversations[index].timeWindow[timeWindowLength - 1].end = new Date();
    }
    await member.save();

    return res.status(200).json({ message: "Group left" })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Could not leave group" });
  }
}
