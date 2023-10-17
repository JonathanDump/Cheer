"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMagicLinkUsed = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const sendMagicLink_1 = __importDefault(require("../helpers/sendMagicLink"));
const app_1 = require("../app");
const findActiveUser_1 = __importDefault(require("../helpers/findActiveUser"));
const createRandomUserName_1 = __importDefault(require("../helpers/createRandomUserName"));
const generateJwtToken_1 = __importDefault(require("../helpers/generateJwtToken"));
const getUserPayload_1 = __importDefault(require("../helpers/getUserPayload"));
const setCount_1 = __importDefault(require("../helpers/setCount"));
const setIsFollowed_1 = __importDefault(require("../helpers/setIsFollowed"));
const config_1 = require("../config/config");
exports.isMagicLinkUsed = false;
exports.signUp = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await user_1.default.findOne({ email }).exec();
    if (user) {
        res.json({ isExist: true });
    }
    else {
        bcrypt_1.default.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
                return next(err);
            }
            const userName = await (0, createRandomUserName_1.default)(name);
            let uploadResult;
            if (req.file) {
                await config_1.cloudinary.uploader.upload(req.file.path, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        uploadResult = result;
                    }
                });
            }
            const user = new user_1.default({
                name: name,
                email: email,
                password: hashedPassword,
                userName,
                image: uploadResult?.url || "",
            });
            await user.save();
            const userPayload = (0, getUserPayload_1.default)(user.toObject());
            const jwtToken = await (0, generateJwtToken_1.default)({ user: userPayload });
            res.json({
                user: userPayload,
                token: `Bearer ${jwtToken}`,
                isSuccess: true,
            });
        });
    }
});
exports.signUpGoogle = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { name, email, img } = req.body;
    let user = await user_1.default.findOne({ email }).exec();
    let isNewUser = false;
    if (!user) {
        const userName = await (0, createRandomUserName_1.default)(name);
        user = new user_1.default({
            name: name,
            email: email,
            userName,
            image: img ? img : "",
        });
        await user.save();
        isNewUser = true;
    }
    const userPayload = (0, getUserPayload_1.default)(user.toObject());
    const jwtToken = await (0, generateJwtToken_1.default)({ user: userPayload });
    res.status(200).json({
        token: `Bearer ${jwtToken}`,
        user: userPayload,
        isNewUser,
    });
});
exports.setUserName = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { userId, userName } = req.body;
    const user = await user_1.default.findById(userId).exec();
    if (!user) {
        res.json({ isSuccess: false });
    }
    else {
        user.userName = userName;
        await user.save();
        const userPayload = (0, getUserPayload_1.default)(user.toObject());
        const token = await (0, generateJwtToken_1.default)({ user: userPayload });
        res.status(200).json({
            token: `Bearer ${token}`,
            user: userPayload,
        });
    }
});
exports.logIn = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await user_1.default.findOne({ email }).exec();
    if (!user) {
        res.json({ invalid: { email: true, password: false } });
        return next();
    }
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match) {
        res.json({ invalid: { password: true, email: false } });
        return next();
    }
    const userPayload = (0, getUserPayload_1.default)(user.toObject());
    if (email === "test@test.com") {
        const token = await (0, generateJwtToken_1.default)({ user: userPayload });
        res.json({
            token: `Bearer ${token}`,
            user: userPayload,
            isTestUser: true,
        });
        return next();
    }
    const token = await (0, generateJwtToken_1.default)({
        user: userPayload,
    }, "15m");
    const isMagicLinkSent = await (0, sendMagicLink_1.default)({
        email: user.email,
        token,
    });
    exports.isMagicLinkUsed = false;
    if (!isMagicLinkSent) {
        res.status(400).json({ isSuccess: false });
        return next();
    }
    res.status(200).json({ user: { _id: user._id }, isSuccess: true });
});
exports.logInVerify = (0, express_async_handler_1.default)(async (req, res, next) => {
    exports.isMagicLinkUsed = true;
    const user = req.user;
    if (!user) {
        res.send("Something went wrong during verification: The link might be expired, try to log in again");
        next(new Error("Invalid jwt or user is not found"));
    }
    const token = await (0, generateJwtToken_1.default)({ user });
    const activeUser = (0, findActiveUser_1.default)(user._id);
    app_1.io.to(activeUser.socketId).emit("receive log in data", {
        token,
        userPayload: user,
    });
    res.send("Log In is successful. Please go back to the site");
});
exports.checkUserName = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = await user_1.default.findOne({ userName: req.query.userName }).exec();
    if (user) {
        res.json({ userNameExists: true });
    }
    else {
        res.json({ userNameExists: false });
    }
});
exports.getUsers = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { _id } = req.user;
    const cursor = parseInt(req.query.cursor) || 0;
    const pageSize = 30;
    const usersDb = await user_1.default.find({
        _id: { $ne: _id },
    })
        .skip(cursor * pageSize)
        .limit(pageSize)
        .select("name userName bio followers image")
        .populate({ path: "followers", match: { _id: _id }, select: "_id" })
        .exec();
    const users = usersDb.map((user) => (0, setCount_1.default)(user.toObject(), ["followers"]));
    const currentPage = cursor;
    const lastPage = Math.ceil((await user_1.default.countDocuments()) / pageSize) - 1;
    res.json({ users, currentPage, lastPage });
});
exports.getUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { userName } = req.query;
    const { _id } = req.user;
    const userDb = await user_1.default.findOne({ userName: userName })
        .select("-posts -password")
        .exec();
    if (!userDb) {
        res.status(400);
    }
    else {
        const user = (0, setCount_1.default)((0, setIsFollowed_1.default)(userDb.toObject(), _id), [
            "following",
            "followers",
        ]);
        res.json(user);
    }
});
exports.getFollowing = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { _id } = req.user;
    const userName = req.query.userName;
    const cursor = parseInt(req.query.cursor) || 0;
    const pageSize = 20;
    const userDb = await user_1.default.findOne({ userName: userName })
        .select("following")
        .populate({
        path: "following",
        select: "name userName bio followers image",
        options: {
            skip: cursor * pageSize,
            limit: pageSize,
            populate: { path: "followers", match: { _id: _id }, select: "_id" },
        },
    })
        .exec();
    if (!userDb) {
        res.status(400).json({ message: "User is not found" });
        return next();
    }
    else if (userDb.following.length === 0) {
        res.json({ users: [], currentPage: 0, lastPage: 0 });
        return next();
    }
    else {
        const users = userDb.following.map((user) => (0, setCount_1.default)(user.toObject(), ["followers"]));
        const currentPage = cursor;
        const lastPage = Math.ceil((await user_1.default.countDocuments({ followers: userDb._id })) / pageSize) - 1;
        res.json({ users, currentPage, lastPage });
    }
});
exports.getFollowers = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { _id } = req.user;
    const userName = req.query.userName;
    const cursor = parseInt(req.query.cursor) || 0;
    const pageSize = 20;
    const userDb = await user_1.default.findOne({ userName: userName })
        .select("followers")
        .populate({
        path: "followers",
        select: "name userName bio followers image",
        options: {
            skip: cursor * pageSize,
            limit: pageSize,
            populate: { path: "followers", match: { _id: _id }, select: "_id" },
        },
    })
        .exec();
    if (!userDb) {
        res.status(400).json({ message: "User is not found" });
        return next();
    }
    else if (userDb.followers.length === 0) {
        res.json({ users: [], currentPage: 0, lastPage: 0 });
        return next();
    }
    else {
        const users = userDb.followers.map((user) => (0, setCount_1.default)(user.toObject(), ["followers"]));
        const currentPage = cursor;
        const lastPage = Math.ceil((await user_1.default.countDocuments({ following: userDb._id })) / pageSize) - 1;
        res.json({ users, currentPage, lastPage });
    }
});
exports.unfollow = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { userId } = req.query;
    const { _id } = req.user;
    await user_1.default.findByIdAndUpdate(_id, {
        $pull: {
            following: userId,
        },
    });
    await user_1.default.findByIdAndUpdate(userId, {
        $pull: {
            followers: _id,
        },
    });
    res.json({ isSuccess: true });
});
exports.follow = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { userId } = req.query;
    const { _id } = req.user;
    await user_1.default.findByIdAndUpdate(_id, {
        $addToSet: {
            following: userId,
        },
    });
    await user_1.default.findByIdAndUpdate(userId, {
        $addToSet: {
            followers: _id,
        },
    });
    res.json({ isSuccess: true });
});
exports.editUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { _id } = req.user;
    const { name, userName, bio, } = req.body;
    let uploadResult;
    if (req.file) {
        await config_1.cloudinary.uploader.upload(req.file.path, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                uploadResult = result;
            }
        });
    }
    const userDb = await user_1.default.findById(_id);
    if (!userDb) {
        res
            .status(500)
            .json({ success: false, message: "Could not update user" });
    }
    else {
        userDb.name = name;
        userDb.userName = userName;
        userDb.bio = bio;
        if (uploadResult) {
            userDb.image = uploadResult.url;
        }
        await userDb.save();
        const userPayload = (0, getUserPayload_1.default)(userDb.toObject());
        const token = await (0, generateJwtToken_1.default)({ user: userPayload });
        res.json({ user: userPayload, success: true, token: `Bearer ${token}` });
    }
});
