import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Post from "../models/post";
import { IUser } from "../interfaces/interfaces";
import envReader from "../helpers/envReader";
import mongoose from "mongoose";
import User from "../models/user";
import setCount from "../helpers/setCount";
import Comment from "../models/comment";

exports.createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { text }: { text: string } = req.body;
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

    const postsDb = await Post.find()
      .skip(cursor * pageSize)
      .limit(pageSize)
      .sort({ date: -1 })
      .populate({
        path: "createdBy",
        select: ["name", "userName", "image"],
      })
      .exec();

    const currentPage = cursor;
    let lastPage = Math.ceil((await Post.countDocuments()) / pageSize) - 1;
    lastPage = lastPage < 0 ? 0 : lastPage;

    const posts = postsDb.map((post) =>
      setCount(post.toObject(), ["comments", "likes"])
    );
    console.log("posts", posts);

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

    const postsDb = await Post.find({ createdBy: userId })
      .skip(cursor * pageSize)
      .limit(pageSize)
      .sort({ date: -1 })
      .populate({
        path: "createdBy",
        select: ["name", "userName", "image"],
      })
      .exec();

    const currentPage = cursor;
    console.log("count", await Post.countDocuments({ createdBy: userId }));

    let lastPage = Math.ceil(
      (await Post.countDocuments({ createdBy: userId })) / pageSize - 1
    );

    lastPage = lastPage < 0 ? 0 : lastPage;
    console.log("lastPage", lastPage);

    const posts = postsDb.map((post) =>
      setCount(post.toObject(), ["comments", "likes"])
    );
    res.json({ posts, currentPage, lastPage });
  }
);

exports.deletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    await Post.deleteOne({ _id: postId });
    await Comment.deleteMany({ post: postId });
    await User.findOneAndUpdate(
      { posts: postId },
      {
        $pull: {
          posts: postId,
        },
      }
    );

    res.json({ isSuccess: true });
  }
);

exports.getPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.query;
    const postDb = await Post.findById(postId).exec();

    if (!postDb) {
      res.status(400);
      return next();
    }

    const post = setCount(postDb.toObject(), ["comments", "likes"]);
    res.json(post);
  }
);
