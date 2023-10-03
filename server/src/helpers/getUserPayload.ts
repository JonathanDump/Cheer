import { IUser } from "../interfaces/interfaces";

export default function getUserPayload(user: IUser) {
  return {
    _id: user._id,
    name: user.name,
    img: user.img,
    userName: user.userName,
    isAdmin: user.isAdmin || undefined,
  };
}
