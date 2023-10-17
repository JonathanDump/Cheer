"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const UserSchema = new mongoose_2.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    userName: String,
    password: String,
    image: String,
    googleId: String,
    isVerified: { type: Boolean, default: false },
    following: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "User", default: [] }],
    followers: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "User", default: [] }],
    isAdmin: { type: Boolean, default: false },
    bio: { type: String, default: "" },
    posts: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "Post", default: [] }],
    comments: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "Comment", default: [] }],
}, { collection: "users" });
exports.default = mongoose_1.default.model("User", UserSchema);
module.exports = mongoose_1.default.model("User", UserSchema);
