import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

import envReader from "../helpers/envReader";
import sendMagicLink from "../helpers/sendMagicLink";
import { IUser } from "../interfaces/interfaces";
import { io } from "../app";
import findActiveUser from "../helpers/findActiveUser";

import createRandomUserName from "../helpers/createRandomUserName";
import generateJwtToken from "../helpers/generateJwtToken";
import getUserPayload from "../helpers/getUserPayload";

export let isMagicLinkUsed = false;

exports.signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.body", req.body);
    console.log("req.file", req.file);
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

        const user = new User({
          name: name,
          email: email,
          password: hashedPassword,
          userName,
          img: req.file
            ? `${envReader("SERVER_URL")}/avatars/${req.file.filename}`
            : "",
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

    console.log("ust type", typeof user);
    let isNewUser = false;

    if (!user) {
      const userName = await createRandomUserName(name);
      user = new User({
        name: name,
        email: email,
        userName,
        img: img ? img : "",
      });
      await user.save();
      isNewUser = true;
    }

    const userPayload = getUserPayload(user.toObject());
    console.log("payload", userPayload);

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
      user.userName = req.body.userName;
      await user!.save();

      res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          userName: user.userName,
          img: user.img,
        },
        isSuccess: true,
      });
    }
  }
);

exports.logIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    console.log("user", user);
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

    console.log("isMagicLinkSent", isMagicLinkSent);

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
    console.log("logInVerify params token", req.query.token);
    isMagicLinkUsed = true;

    const user = req.user as IUser;
    console.log("verify user", user);

    if (!user) {
      res.send(
        "Something went wrong during verification: The link might be expired, try to log in again"
      );

      next(new Error("Invalid jwt or user is not found"));
    }

    const token = await generateJwtToken({ user });

    const activeUser = findActiveUser(user._id);
    console.log("log in verify active user", activeUser);

    io.to(activeUser.socketId).emit("receive log in data", {
      token,
      userPayload: user,
    });

    res.send("Log In is successful. Please go back to the site");
  }
);

exports.checkUserName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ userName: req.body.userName }).exec();
    console.log("check user name");

    if (user) {
      res.json({ userNameExists: true });
    } else {
      res.json({ userNameExists: false });
    }
  }
);
