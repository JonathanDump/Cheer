import { format, isThisYear, parseISO } from "date-fns";
import {
  IDecodedJwt,
  IPost,
  IPostCardProps,
} from "../../interfaces/interfaces";
import cl from "./PostCard.module.scss";
import { useState } from "react";
import jwtDecode from "jwt-decode";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { useParams } from "react-router-dom";
import { queryClient } from "../../config/config";
import getObjectCopy from "../../helpers/functions/getObjectCopy";

export default function PostCard({ post }: IPostCardProps) {
  const { _id, text, images, date, likes, comments, createdBy } = post;
  console.log("createdBy", createdBy);

  const token = getItemFromLocalStorage("token") as string;
  const formattedDate =
    date &&
    format(
      parseISO(date),
      `${isThisYear(parseISO(date)) ? "dd MMM" : "dd MMM yyyy"} `
    );
  const { user } = jwtDecode(token) as IDecodedJwt;

  const [isDropDownVisible, setIsDropDawnVisible] = useState(false);

  const { userName } = useParams();

  const deletePostMutation = useMutation({
    mutationFn: fetcher.delete.deletePost,
    onSuccess: (response) => {
      console.log("response", response);

      const key = userName ? "user posts" : "home posts";
      console.log("key", key);

      queryClient.setQueriesData([key], (oldData: unknown) => {
        if (oldData) {
          const copyOldData = getObjectCopy(oldData);
          copyOldData.pages[0].posts = copyOldData.pages[0].posts.filter(
            (post: IPost) => post._id !== _id
          );
          return copyOldData;
        }
        return oldData;
      });
    },
  });

  const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDropDawnVisible(!isDropDownVisible);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deletePostMutation.mutate({ postId: _id, token });
  };

  return (
    <div className={cl.postCard}>
      <div className={cl.avatarContainer}>
        <img src={createdBy.image} />
      </div>
      <div className={cl.content}>
        <div className={cl.meta}>
          <div className={cl.name}>{createdBy.name}</div>
          <div className={cl.userName}>@{createdBy.userName}</div>
          <div className={cl.date}>{formattedDate}</div>

          {(user.isAdmin || user._id === createdBy._id) && (
            <div className={cl.settings}>
              <button type="button" onClick={handleSettingsClick}>
                ...
              </button>
              {isDropDownVisible && (
                <div className={cl.dropDown}>
                  <button
                    type="button"
                    className={cl.setting}
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={cl.text}>{text}</div>
        <div className={cl.images}>
          {!!images.length && images.map((img) => <img src={img}></img>)}
        </div>
        <div className={cl.actions}>
          <button className={cl.like}>Likes {likes.length}</button>
          <button className={cl.comment}>Comments {comments.length}</button>
        </div>
      </div>
    </div>
  );
}
