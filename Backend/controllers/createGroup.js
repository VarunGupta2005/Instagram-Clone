import User from "../models/User";
import Conversation from "../models/Conversation";

export default async (req, res) => {
  try {
    const createdBy = req.username;
    const { participants, groupName } = req.body;
    const users = await User.find({ username: { $in: participants } }).select("_id");
    const creator = await User.findOne({ username: createdBy }).select("_id");
    if (!creator) return res.status(400).send("User not found");
    if (users.length !== participants.length) return res.status(400).send("Participants not found");
    const timestamp = new Date();
    const participantIds = [creator._id, ...users.map(user => user._id)];
    const group = new Conversation({
      participants: participantIds,
      isGroup: true,
      groupName: groupName,
      admin: creator._id
    })
    await group.save();
    const conId = group._id;
    await User.updateMany({ _id: { $in: participantIds } }, { $push: { conversations: { conversationId: conId, timeWindow: [{ start: timestamp }] } } });
    return res.status(200).json({ message: "Group created", group });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Group not created");
  }
}