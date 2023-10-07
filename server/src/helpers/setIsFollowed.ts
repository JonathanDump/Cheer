import { IUser } from "../interfaces/interfaces";

export default function setIsFollowed(user: IUser, id: string) {
  console.log("followers", user.followers[0]);

  const isFollowed = user.followers.some(
    (followerId) => followerId.toString() === id
  );
  user.isFollowed = isFollowed;
  return user;
}
