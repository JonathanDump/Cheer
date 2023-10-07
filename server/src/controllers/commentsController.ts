import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Post from "../models/post";
import User from "../models/user";
import Comment from "../models/comment";
import mongoose from "mongoose";
import { IUser } from "../interfaces/interfaces";
import envReader from "../helpers/envReader";
import setCount from "../helpers/setCount";

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

exports.deleteComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    await Comment.deleteOne({ _id: commentId });

    await Post.findOneAndUpdate(
      { comments: commentId },
      {
        $pull: {
          comments: commentId,
        },
      }
    );

    res.json({ isSuccess: true });
  }
);

exports.getComments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cursor = parseInt(req.query.cursor as string) || 0;
    const { postId } = req.query;
    const pageSize = 20;

    const commentsDb = await Comment.find({ post: postId })
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

    const comments = commentsDb.map((comment) =>
      setCount(comment.toObject(), ["likes"])
    );

    const currentPage = cursor;

    let lastPage = Math.ceil(
      (await Comment.countDocuments({ post: postId })) / pageSize - 1
    );

    lastPage = lastPage < 0 ? 0 : lastPage;
    res.json({ comments, currentPage, lastPage });
  }
);
