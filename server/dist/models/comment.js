"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const CommentSchema = new mongoose_2.Schema({
    post: { type: mongoose_2.Schema.Types.ObjectId, required: true },
    text: String,
    createdBy: { type: mongoose_2.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: new Date() },
    likes: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "User", default: [] }],
    images: [{ type: String, default: [] }],
});
exports.default = mongoose_1.default.model("Comment", CommentSchema);
module.exports = mongoose_1.default.model("Comment", CommentSchema);
