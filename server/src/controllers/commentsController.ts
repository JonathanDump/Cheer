import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Post from "../models/post";
import User from "../models/user";
import Comment from "../models/comment";
import mongoose from "mongoose";
import { IUser } from "../interfaces/interfaces";
import envReader from "../helpers/envReader";

exports.createComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { text, postId }: { text: string; postId: string } = req.body;
    const user = req.user as IUser;
    const files = req.files as Express.Multer.File[];

    const images = files?.map(
      (file) => `${envReader("SERVER_URL")}/images/${file.filename}`
    );

    const comment = new Comment({
      _id: new mongoose.Types.ObjectId(),
      text,
      createdBy: user._id,
      post: postId,
      images,
    });
    await comment.save();

    await User.findByIdAndUpdate(user._id, {
      $push: {
        comments: comment._id,
      },
    });

    await Post.findByIdAndUpdate(postId, {
      $push: {
        comments: comment._id,
      },
    });

    res.json(comment);
  }
);
