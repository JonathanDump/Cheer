"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const post_1 = __importDefault(require("../models/post"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const setCount_1 = __importDefault(require("../helpers/setCount"));
const comment_1 = __importDefault(require("../models/comment"));
const setIsLiked_1 = __importDefault(require("../helpers/setIsLiked"));
const config_1 = require("../config/config");
exports.createPost = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { text } = req.body;
    const files = req.files;
    const user = req.user;
    const userDb = await user_1.default.findById(user._id);
    let images = [];
    if (files) {
        const uploadPromises = files.map((file) => {
            return new Promise((resolve, reject) => {
                config_1.cloudinary.uploader.upload(file.path, (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else if (result) {
                        images.push(result.url);
                        resolve(result.url);
                    }
                });
            });
        });
        try {
            await Promise.all(uploadPromises);
        }
        catch (err) {
            console.log(err);
        }
    }
    const post = new post_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        text,
        createdBy: user._id,
        images: images,
        date: new Date(),
    });
    await post.save();
    userDb.posts.push(post._id);
    await userDb?.save();
    res.json(post);
});
exports.getPosts = (0, express_async_handler_1.default)(async (req, res, next) => {
    const cursor = parseInt(req.query.cursor) || 0;
    const pageSize = 10;
    const { _id } = req.user;
    const postsDb = await post_1.default.find()
        .skip(cursor * pageSize)
        .limit(pageSize)
        .sort({ date: -1 })
        .populate({
        path: "createdBy",
        select: ["name", "userName", "image"],
    })
        .exec();
    const currentPage = cursor;
    let lastPage = Math.ceil((await post_1.default.countDocuments()) / pageSize) - 1;
    lastPage = lastPage < 0 ? 0 : lastPage;
    const posts = postsDb.map((post) => (0, setCount_1.default)((0, setIsLiked_1.default)(post.toObject(), _id), ["comments", "likes"]));
    res.json({ posts, currentPage, lastPage });
});
exports.getUserPosts = (0, express_async_handler_1.default)(async (req, res, next) => {
    const cursor = parseInt(req.query.cursor) || 0;
    const pageSize = 10;
    const { userId } = req.query;
    const { _id } = req.user;
    const postsDb = await post_1.default.find({ createdBy: userId })
        .skip(cursor * pageSize)
        .limit(pageSize)
        .sort({ date: -1 })
        .populate({
        path: "createdBy",
        select: ["name", "userName", "image"],
    })
        .exec();
    const currentPage = cursor;
    let lastPage = Math.ceil((await post_1.default.countDocuments({ createdBy: userId })) / pageSize - 1);
    lastPage = lastPage < 0 ? 0 : lastPage;
    const posts = postsDb.map((post) => (0, setCount_1.default)((0, setIsLiked_1.default)(post.toObject(), _id), ["comments", "likes"]));
    res.json({ posts, currentPage, lastPage });
});
exports.deletePost = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { postId } = req.params;
    await post_1.default.deleteOne({ _id: postId });
    await comment_1.default.deleteMany({ post: postId });
    await user_1.default.findOneAndUpdate({ posts: postId }, {
        $pull: {
            posts: postId,
        },
    });
    res.json({ isSuccess: true });
});
exports.getPost = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { postId } = req.query;
    const { _id } = req.user;
    const postDb = await post_1.default.findById(postId).exec();
    if (!postDb) {
        res.status(400);
        return next();
    }
    const post = (0, setCount_1.default)((0, setIsLiked_1.default)(postDb.toObject(), _id), [
        "comments",
        "likes",
    ]);
    res.json(post);
});
exports.setLike = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { postId } = req.query;
    const { _id } = req.user;
    await post_1.default.findByIdAndUpdate(postId, {
        $addToSet: {
            likes: _id,
        },
    });
    res.json({ isSuccess: true });
});
exports.removeLike = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { postId } = req.query;
    const { _id } = req.user;
    await post_1.default.findByIdAndUpdate(postId, {
        $pull: {
            likes: _id,
        },
    });
    res.json({ isSuccess: true });
});
