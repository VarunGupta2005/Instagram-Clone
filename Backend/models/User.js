import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    resetTokenVersion: {
      type: Number,
      default: 0,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    profilePicture: {
      type: String,
      default: "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-15.jpg",
    },
    bio: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    privacy: {
      type: String,
      enum: ["Public", "Private"], // Account privacy settings
      default: "Public", // Default is public
    },
    followRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    conversations: [{
      conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
      timeWindow: [{ start: { type: Date }, end: { type: Date, default: null } }]
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
