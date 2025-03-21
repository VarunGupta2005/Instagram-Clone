import mongoose, { mongo } from "mongoose"
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  isGroup: { type: Boolean, default: false },
  groupName: { type: String },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;