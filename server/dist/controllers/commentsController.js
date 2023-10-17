"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const comment_1 = __importDefault(require("../models/comment"));
const mongoose_1 = __importDefault(require("mongoose"));
const envReader_1 = __importDefault(require("../helpers/envReader"));
const setCount_1 = __importDefault(require("../helpers/setCount"));
const setIsLiked_1 = __importDefault(require("../helpers/setIsLiked"));
exports.createComment = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { text, postId } = req.body;
    const user = req.user;
    const files = req.files;
    const images = files?.map((file) => `${(0, envReader_1.default)("SERVER_URL")}/images/${file.filename}`);
    const comment = new comment_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        text,
        createdBy: user._id,
        post: postId,
        images,
    });
    await comment.save();
    await user_1.default.findByIdAndUpdate(user._id, {
        $push: {
            comments: comment._id,
        },
    });
    await post_1.default.findByIdAndUpdate(postId, {
        $push: {
            comments: comment._id,
        },
    });
    res.json(comment);
});
exports.deleteComment = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { commentId } = req.params;
    await comment_1.default.deleteOne({ _id: commentId });
    await post_1.default.findOneAndUpdate({ comments: commentId }, {
        $pull: {
            comments: commentId,
        },
    });
    res.json({ isSuccess: true });
});
exports.getComments = (0, express_async_handler_1.default)(async (req, res, next) => {
    const cursor = parseInt(req.query.cursor) || 0;
    const { postId } = req.query;
    const { _id } = req.user;
    const pageSize = 20;
    const commentsDb = await comment_1.default.find({ post: postId })
        .skip(cursor * pageSize)
        .limit(pageSize)
        .sort({ date: 1 })
        .populate({
        path: "createdBy",
        select: ["name", "userName", "image"],
    })
        .exec();
    if (!commentsDb) {
        res.status(400);
        next();
    }
    const comments = commentsDb.map((comment) => (0, setCount_1.default)((0, setIsLiked_1.default)(comment.toObject(), _id), ["likes"]));
    const currentPage = cursor;
    let lastPage = Math.ceil((await comment_1.default.countDocuments({ post: postId })) / pageSize - 1);
    lastPage = lastPage < 0 ? 0 : lastPage;
    res.json({ comments, currentPage, lastPage });
});
exports.setLike = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { commentId } = req.query;
    const { _id } = req.user;
    await comment_1.default.findByIdAndUpdate(commentId, {
        $addToSet: {
            likes: _id,
        },
    });
    res.json({ isSuccess: true });
});
exports.removeLike = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { commentId } = req.query;
    const { _id } = req.user;
    await comment_1.default.findByIdAndUpdate(commentId, {
        $pull: {
            likes: _id,
        },
    });
    res.json({ isSuccess: true });
});
