import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  senderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  message:{
    type: String,
    required: true,
  }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
