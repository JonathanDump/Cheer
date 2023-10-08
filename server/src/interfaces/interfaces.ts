import { ObjectId, Types } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  userName?: string;
  isVerified: boolean;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  image?: string | undefined;
  googleId?: string | undefined;
  password?: string | undefined;
  isAdmin?: boolean;
  bio?: string;
  posts?: Types.ObjectId[];
  comments?: Types.ObjectId;
  isFollowed?: boolean;
}

export interface IActiveUser {
  userId: string;
  socketId: string;
}

export interface IDecodedJwt {
  iat: number;
  exp: number;
  user: IUser;
}

export interface IPost {
  _id: ObjectId;
  date: Date;
  images: string[];
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  createdBy: Types.ObjectId;
  text?: string | undefined;
  isLiked?: boolean;
}
