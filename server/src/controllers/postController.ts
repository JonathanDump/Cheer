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
    });
    console.log("post", post);

    await post.save();

    res.json(post);
  }
);
