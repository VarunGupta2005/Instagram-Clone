import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
