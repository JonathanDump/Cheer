import { IUser } from "../interfaces/interfaces";

export default function setIsFollowed(user: IUser, id: string) {
  const isFollowed = user.followers.some(
    (followerId) => followerId.toString() === id
  );
  user.isFollowed = isFollowed;
  return user;
}
