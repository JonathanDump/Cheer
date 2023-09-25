import mongoose from "mongoose";
import { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    text: String,
    img: String,
    date: { type: Date, default: new Date() },
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { collection: "posts" }
);

export default mongoose.model("Post", PostSchema);
module.exports = mongoose.model("Post", PostSchema);
