import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import sendMagicLink from "../helpers/sendMagicLink";
import { IUser } from "../interfaces/interfaces";
import { io } from "../app";
import findActiveUser from "../helpers/findActiveUser";
import createRandomUserName from "../helpers/createRandomUserName";
import generateJwtToken from "../helpers/generateJwtToken";
import getUserPayload from "../helpers/getUserPayload";
import setCount from "../helpers/setCount";
import setIsFollowed from "../helpers/setIsFollowed";
import { cloudinary } from "../config/config";
import { UploadApiResponse } from "cloudinary";
import { Document } from "mongoose";

export let isMagicLinkUsed = false;

exports.signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (user) {
      res.json({ isExist: true });
    } else {
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        const userName = await createRandomUserName(name);

        let uploadResult: UploadApiResponse | undefined;
        if (req.file) {
          await cloudinary.uploader.upload(req.file.path, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              uploadResult = result;
            }
          });
        }

        const user = new User({
          name: name,
          email: email,
          password: hashedPassword,
          userName,
          image: uploadResult?.url || "",
        });

        await user.save();
        const userPayload = getUserPayload(user.toObject());

        const jwtToken = await generateJwtToken({ user: userPayload });
        res.json({
          user: userPayload,
          token: `Bearer ${jwtToken}`,
          isSuccess: true,
        });
      });
    }
  }
);

exports.signUpGoogle = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, img } = req.body;

    let user = await User.findOne({ email }).exec();

    let isNewUser = false;

    if (!user) {
      const userName = await createRandomUserName(name);
      user = new User({
        name: name,
        email: email,
        userName,
        image: img ? img : "",
      });
      await user.save();
      isNewUser = true;
    }

    const userPayload = getUserPayload(user.toObject());

    const jwtToken = await generateJwtToken({ user: userPayload });

    res.status(200).json({
      token: `Bearer ${jwtToken}`,
      user: userPayload,
      isNewUser,
    });
  }
);

exports.setUserName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, userName } = req.body;
    const user = await User.findById(userId).exec();

    if (!user) {
      res.json({ isSuccess: false });
    } else {
      user.userName = userName;
      await user!.save();

      const userPayload = getUserPayload(user.toObject());
      const token = await generateJwtToken({ user: userPayload });

      res.status(200).json({
        token: `Bearer ${token}`,
        user: userPayload,
      });
    }
  }
);

exports.logIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
      res.json({ invalid: { email: true, password: false } });
      return next();
    }

    const match = await bcrypt.compare(password, user!.password!);

    if (!match) {
      res.json({ invalid: { password: true, email: false } });
      return next();
    }

    const userPayload = getUserPayload(user.toObject());

    if (email === "test@test.com") {
      const token = await generateJwtToken({ user: userPayload });
      res.json({
        token: `Bearer ${token}`,
        user: userPayload,
        isTestUser: true,
      });
      return next();
    }

    const token = await generateJwtToken(
      {
        user: userPayload,
      },
      "15m"
    );

    const isMagicLinkSent = await sendMagicLink({
      email: user!.email,
      token,
    });

    isMagicLinkUsed = false;

    if (!isMagicLinkSent) {
      res.status(400).json({ isSuccess: false });
      return next();
    }
    res.status(200).json({ user: { _id: user._id }, isSuccess: true });
  }
);

exports.logInVerify = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    isMagicLinkUsed = true;

    const user = req.user as IUser;

    if (!user) {
      res.send(
        "Something went wrong during verification: The link might be expired, try to log in again"
      );

      next(new Error("Invalid jwt or user is not found"));
    }

    const token = await generateJwtToken({ user });

    const activeUser = findActiveUser(user._id);

    io.to(activeUser.socketId).emit("receive log in data", {
      token,
      userPayload: user,
    });

    res.send("Log In is successful. Please go back to the site");
  }
);

exports.checkUserName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ userName: req.query.userName }).exec();

    if (user) {
      res.json({ userNameExists: true });
    } else {
      res.json({ userNameExists: false });
    }
  }
);

exports.getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user as IUser;
    const cursor = parseInt(req.query.cursor as string) || 0;
    const pageSize = 30;
    const usersDb = await User.find({
      _id: { $ne: _id },
    })
      .skip(cursor * pageSize)
      .limit(pageSize)
      .select("name userName bio followers image")
      .populate({ path: "followers", match: { _id: _id }, select: "_id" })
      .exec();

    const users = usersDb.map((user) =>
      setCount(user.toObject(), ["followers"])
    );
    const currentPage = cursor;
    const lastPage = Math.ceil((await User.countDocuments()) / pageSize) - 1;

    res.json({ users, currentPage, lastPage });
  }
);

exports.getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName } = req.query;

    const { _id } = req.user as IUser;

    const userDb = await User.findOne({ userName: userName })
      .select("-posts -password")
      .exec();

    if (!userDb) {
      res.status(400);
    } else {
      const user = setCount(setIsFollowed(userDb.toObject(), _id), [
        "following",
        "followers",
      ]);

      res.json(user);
    }
  }
);

exports.getFollowing = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user as IUser;
    const userName = req.query.userName as string;
    const cursor = parseInt(req.query.cursor as string) || 0;
    const pageSize = 20;

    const userDb = await User.findOne({ userName: userName })
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
    } else if (userDb.following.length === 0) {
      res.json({ users: [], currentPage: 0, lastPage: 0 });
      return next();
    } else {
      const users = userDb.following.map((user: any) =>
        setCount(user.toObject(), ["followers"])
      );

      const currentPage = cursor;
      const lastPage =
        Math.ceil(
          (await User.countDocuments({ followers: userDb._id })) / pageSize
        ) - 1;

      res.json({ users, currentPage, lastPage });
    }
  }
);

exports.getFollowers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user as IUser;
    const userName = req.query.userName as string;
    const cursor = parseInt(req.query.cursor as string) || 0;
    const pageSize = 20;

    const userDb = await User.findOne({ userName: userName })
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
    } else if (userDb.followers.length === 0) {
      res.json({ users: [], currentPage: 0, lastPage: 0 });
      return next();
    } else {
      const users = userDb.followers.map((user: any) =>
        setCount(user.toObject(), ["followers"])
      );

      const currentPage = cursor;
      const lastPage =
        Math.ceil(
          (await User.countDocuments({ following: userDb._id })) / pageSize
        ) - 1;

      res.json({ users, currentPage, lastPage });
    }
  }
);

exports.unfollow = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;
    const { _id } = req.user as IUser;

    await User.findByIdAndUpdate(_id, {
      $pull: {
        following: userId,
      },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: {
        followers: _id,
      },
    });

    res.json({ isSuccess: true });
  }
);

exports.follow = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;

    const { _id } = req.user as IUser;

    await User.findByIdAndUpdate(_id, {
      $addToSet: {
        following: userId,
      },
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        followers: _id,
      },
    });
    res.json({ isSuccess: true });
  }
);

exports.editUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user as IUser;
    const {
      name,
      userName,
      bio,
    }: { name: string; userName: string; bio: string } = req.body;

    let uploadResult: UploadApiResponse | undefined;
    if (req.file) {
      await cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          uploadResult = result;
        }
      });
    }

    const userDb = await User.findById(_id);

    if (!userDb) {
      res
        .status(500)
        .json({ success: false, message: "Could not update user" });
    } else {
      userDb.name = name;
      userDb.userName = userName;
      userDb.bio = bio;
      if (uploadResult) {
        userDb.image = uploadResult.url;
      }

      await userDb.save();

      const userPayload = getUserPayload(userDb.toObject());
      const token = await generateJwtToken({ user: userPayload });
      res.json({ user: userPayload, success: true, token: `Bearer ${token}` });
    }
  }
);
