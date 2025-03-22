import User from "../../models/User.js";
import Conversation from "../../models/Conversation.js";

export default async function addMembers(req, res) {
  try {
    const { conversationId, newMembersId } = req.body;
    const user = req.username;

    const [sender, conversation, newMembers] = await Promise.all([User.findOne({ username: user }).select("_id"), Conversation.findById(conversationId), User.find({ _id: { $in: newMembersId } }).select("_id conversations")])
    if (!sender) return res.status(404).send("User not found");
    if (!conversation || !conversation.isGroup)
      return res.status(404).send("Group chat not found");

    if (!conversation.participants.some(id => id.equals(sender._id)))
      return res.status(403).send("Only a group member can add members");

    const time = new Date();

    for (const member of newMembers) {
      if (!conversation.participants.some(id => id.equals(member._id))) {
        conversation.participants.push(member._id);
      }
      else {
        continue;
      }
      if (!member.conversations.some(con => con.conversationId.equals(conversationId))) {
        member.conversations.push({ conversationId: conversationId, timeWindow: [{ start: time }] });
      }
      else {
        const index = member.conversations.findIndex(con => con.conversationId.equals(conversationId));
        const historyLength = member.conversations[index].timeWindow.length;
        if (member.conversations[index].timeWindow[historyLength - 1].end !== null) {
          member.conversations[index].timeWindow.push({ start: time });
        }
      }
      await member.save();
    };
    await conversation.save();
    return res.status(200).send("Members added successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Could not add members");
  }
}
