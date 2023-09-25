import { Types } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  img?: string | undefined;
  googleId?: string | undefined;
  password?: string | undefined;
}

export interface IActiveUser {
  userId: string;
  socketId: string;
}
