import User from "../../models/User.js";
import Conversation from "../../models/Conversation.js";

export default async function removeMember(req, res) {
  try {
    const { conversationId, memberId } = req.body;
    const user = req.username;

    const [sender, conversation, member] = await Promise.all([User.findOne({ username: user }).select("_id"), Conversation.findById(conversationId), User.findById(memberId).select("_id conversations")])

    // Check if remove member request is valid
    if (!sender) return res.status(404).send("User not found");
    if (!conversation || !conversation.isGroup)
      return res.status(404).send("Group chat not found");
    if (!conversation.admin.equals(sender._id))
      return res.status(403).send("Only admin can remove members");
    if (sender._id.equals(memberId))
      return res.status(403).send("Admin cannot remove themselves from the group");

    //check if member is part of group
    const participantIndex = conversation.participants.findIndex(p => p.equals(memberId));
    if (participantIndex === -1)
      return res.status(404).send("Member not part of group");

    //remove participant from conversation
    await Conversation.findByIdAndUpdate(conversationId, { $pull: { participants: memberId } });

    //update end in the conversations section of removed member
    const conversationIndex = member.conversations.findIndex(con => con.conversationId.equals(conversationId))
    if (conversationIndex !== -1) {
      const timeWindowLength = member.conversations[conversationIndex].timeWindow.length;
      member.conversations[conversationIndex].timeWindow[timeWindowLength - 1].end = new Date();
      await member.save();
    }

    return res.status(200).send("Member removed successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Could not remove member");
  }
}
