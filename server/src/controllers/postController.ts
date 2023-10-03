import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Post from "../models/post";
import { IUser } from "../interfaces/interfaces";
import envReader from "../helpers/envReader";

exports.createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { text }: { text: string; userId: string } = req.body;
    const files = req.files as Express.Multer.File[];
    console.log("files", files);

    const user = req.user as IUser;
    const images = files?.map(
      (file) => `${envReader("SERVER_URL")}/images/${file.filename}`
    );

    const post = new Post({
      text,
      createdBy: user._id,
      images: images || [],
      date: new Date(),
    });
    console.log("post", post);

    await post.save();

    res.json(post);
  }
);

exports.getPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cursor = parseInt(req.query.cursor as string) || 0;
    const pageSize = 5;

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
    const lastPage = Math.ceil((await Post.countDocuments()) / pageSize) - 1;

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
