import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import envReader from "../helpers/envReader";
import sendMagicLink from "../helpers/sendMagicLink";
import { IDecodedJwt, IUser } from "../interfaces/intefaces";
import { io } from "../app";
import findActiveUser from "../helpers/findActiveUser";
import { error } from "console";
import createRandomUserName from "../helpers/createRandomUserName";
import generateJwtToken from "../helpers/generateJwtToken";
import jwtDecode from "jwt-decode";
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
        const userPayload = {
          _id: user._id,
          name: user.name,
          img: user.img,
          userName,
        };

        const jwtToken = await generateJwtToken({ user: userPayload });
        res.json({
          user: userPayload,
          token: `Bearer ${jwtToken}`,
          isSuccess: true,
        });

        // res.json({
        //   userId: user._id,
        //   isSuccess: true,
        // });
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
        img: img ? img : "",
      });
      await user.save();
      isNewUser = true;
    }

    const userPayload = {
      _id: user._id,
      name: user.name,
      img: user.img,
      userName: user.userName,
    };

    const jwtToken = await generateJwtToken({ user: userPayload });

    res.status(200).json({
      token: `Bearer ${jwtToken}`,
      user: userPayload,
      isNewUser,
    });
    // res.status(200).json({
    //   userId: user._id,
    //   isSuccess: true,
    // });
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
    console.log("req body", req.body);

    const { email, password } = req.body;
    console.log("email", email);

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

    const userPayload = {
      name: user!.name,
      email: user!.email,
      userName: user!.userName,
      img: user!.img,
      _id: user!._id,
    };

    const token = await generateJwtToken(
      {
        user: userPayload,
      },
      "15m"
    );
    // const opts: SignOptions = {};
    // opts.expiresIn = "15m";
    // const secret: Secret = envReader("JWT_SECRET_KEY");
    // const token = await jwt.sign(
    //   {
    //     user: {
    //       _id: user!._id,
    //     },
    //   },
    //   secret,
    //   opts
    // );

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

    const decodedJwt = jwtDecode(req.query.token as string) as IDecodedJwt;
    console.log("decodedJwt", decodedJwt);

    const user = decodedJwt.user;

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

    res.redirect(envReader("CLIENT_SERVER_URL"));
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
