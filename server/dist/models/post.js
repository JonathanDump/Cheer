"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const PostSchema = new mongoose_2.Schema({
    text: String,
    images: [{ type: String, default: [] }],
    date: { type: Date, default: new Date() },
    likes: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "Comment", default: [] }],
    createdBy: { type: mongoose_2.Schema.Types.ObjectId, ref: "User", required: true },
}, { collection: "posts" });
exports.default = mongoose_1.default.model("Post", PostSchema);
module.exports = mongoose_1.default.model("Post", PostSchema);
