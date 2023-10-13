import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Post from "../models/post";
import { IUser } from "../interfaces/interfaces";
import envReader from "../helpers/envReader";
import mongoose from "mongoose";
import User from "../models/user";
import setCount from "../helpers/setCount";
import Comment from "../models/comment";
import setIsLiked from "../helpers/setIsLiked";
import { cloudinary } from "../config/config";
import { log } from "console";

exports.createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { text }: { text: string } = req.body;
    const files = req.files as Express.Multer.File[];
    console.log("files", files);

    const user = req.user as IUser;
    const userDb = await User.findById(user._id);

    let images: string[] = [];
    if (files) {
      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file.path, (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else if (result) {
              console.log("result", result);
              images.push(result.url);
              resolve(result.url);
            }
          });
        });
      });

      try {
        await Promise.all(uploadPromises);
      } catch (err) {
        console.log(err);
      }
    }

    const post = new Post({
      _id: new mongoose.Types.ObjectId(),
      text,
      createdBy: user._id,
      images: images,
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

    const { _id } = req.user as IUser;

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
      setCount(setIsLiked(post.toObject(), _id), ["comments", "likes"])
    );
    console.log("posts", posts);

    res.json({ posts, currentPage, lastPage });
  }
);

exports.getUserPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cursor = parseInt(req.query.cursor as string) || 0;
    const pageSize = 10;

    const { userId } = req.query;
    const { _id } = req.user as IUser;

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
      setCount(setIsLiked(post.toObject(), _id), ["comments", "likes"])
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
    const { _id } = req.user as IUser;
    const postDb = await Post.findById(postId).exec();

    if (!postDb) {
      res.status(400);
      return next();
    }

    const post = setCount(setIsLiked(postDb.toObject(), _id), [
      "comments",
      "likes",
    ]);
    res.json(post);
  }
);

exports.setLike = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.query;
    const { _id } = req.user as IUser;

    await Post.findByIdAndUpdate(postId, {
      $addToSet: {
        likes: _id,
      },
    });

    res.json({ isSuccess: true });
  }
);

exports.removeLike = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.query;
    const { _id } = req.user as IUser;

    await Post.findByIdAndUpdate(postId, {
      $pull: {
        likes: _id,
      },
    });

    res.json({ isSuccess: true });
  }
);
