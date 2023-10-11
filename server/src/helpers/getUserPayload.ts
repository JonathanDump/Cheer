import { IUser } from "../interfaces/interfaces";

export default function getUserPayload(user: IUser) {
  return {
    _id: user._id,
    name: user.name,
    image: user.image,
    userName: user.userName,
    isAdmin: user.isAdmin || undefined,
    bio: user.bio,
  };
}
