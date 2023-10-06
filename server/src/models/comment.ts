import mongoose from "mongoose";
import { Schema } from "mongoose";

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, required: true },
  text: String,
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: new Date() },
  likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  images: [{ type: String, default: [] }],
});

export default mongoose.model("Comment", CommentSchema);
module.exports = mongoose.model("Comment", CommentSchema);
