import { IPost } from "../interfaces/interfaces";

export default function setIsLiked(obj: IPost, id: string) {
  const isLiked = obj.likes.some((like) => like.toString() === id);
  obj.isLiked = isLiked;
  return obj;
}
