import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userName: String,
    password: String,
    image: String,
    googleId: String,
    isVerified: { type: Boolean, default: false },
    following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    isAdmin: { type: Boolean, default: false },
    bio: { type: String, default: "" },
  },
  { collection: "users" }
);

export default mongoose.model("User", UserSchema);
module.exports = mongoose.model("User", UserSchema);
