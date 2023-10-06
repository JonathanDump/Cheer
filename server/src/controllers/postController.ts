import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Post from "../models/post";
import { IUser } from "../interfaces/interfaces";
import envReader from "../helpers/envReader";
import mongoose from "mongoose";
import User from "../models/user";

exports.createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { text }: { text: string; userId: string } = req.body;
    const files = req.files as Express.Multer.File[];
    console.log("files", files);

    const user = req.user as IUser;
    const userDb = await User.findById(user._id);

    const images = files?.map(
      (file) => `${envReader("SERVER_URL")}/images/${file.filename}`
    );

    const post = new Post({
      _id: new mongoose.Types.ObjectId(),
      text,
      createdBy: user._id,
      images: images || [],
      date: new Date(),
    });
    console.log("post", post);

    await post.save();
    userDb!.posts.push(post._id);
    await userDb?.save();
    res.json(post);
  }
);

exports.getPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cursor = parseInt(req.query.cursor as string) || 0;
    const pageSize = 10;

    console.log("cursor", req.query.cursor);

    const posts = await Post.find()
      .skip(cursor * pageSize)
      .limit(pageSize)
      .sort({ date: -1 })
      .populate({
        path: "createdBy",
        select: ["name", "userName", "image"],
      })
      .exec();
    console.log("posts", posts);

    const currentPage = cursor;
    let lastPage = Math.ceil((await Post.countDocuments()) / pageSize) - 1;
    lastPage = lastPage < 0 ? 0 : lastPage;
    res.json({ posts, currentPage, lastPage });
  }
);

exports.getUserPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cursor = parseInt(req.query.cursor as string) || 0;
    const { userId } = req.query;
    console.log("userId", userId);

    const pageSize = 10;

    console.log("cursor", req.query.cursor);

    const posts = await Post.find({ createdBy: userId })
      .skip(cursor * pageSize)
      .limit(pageSize)
      .sort({ date: -1 })
      .populate({
        path: "createdBy",
        select: ["name", "userName", "image"],
      })
      .exec();
    console.log("posts", posts);

    const currentPage = cursor;
    console.log("count", await Post.countDocuments({ createdBy: userId }));

    let lastPage = Math.ceil(
      (await Post.countDocuments({ createdBy: userId })) / pageSize - 1
    );

    lastPage = lastPage < 0 ? 0 : lastPage;
    console.log("lastPage", lastPage);

    res.json({ posts, currentPage, lastPage });
  }
);

exports.deletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    await Post.deleteOne({ _id: postId });

    res.json({ isSuccess: true });
  }
);
