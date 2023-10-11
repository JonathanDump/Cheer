import { format, isThisYear, parseISO } from "date-fns";
import {
  IDecodedJwt,
  IPostOrCommentCardProps,
} from "../../interfaces/interfaces";
import cl from "./PostOrCard.module.scss";
import { useState } from "react";
import jwtDecode from "jwt-decode";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { useNavigate } from "react-router-dom";
import { onSuccess } from "../../helpers/functions/onSuccess/onSuccess";
import { queryClient } from "../../config/config";
import { commentKeys, postKeys } from "../../config/queryKeys";

export default function PostOrCommentCard({
  data,
  type,
}: IPostOrCommentCardProps) {
  const { _id, text, images, date, comments, createdBy } = data;
  const [likes, setLikes] = useState(data.likes);
  const [isLiked, setIsLiked] = useState(data.isLiked);

  const likeButtonClass = isLiked ? `${cl.like} ${cl.liked}` : `${cl.like}`;

  const likeAction = isLiked ? "remove" : "set";

  const token = getItemFromLocalStorage("token") as string;
  const formattedDate =
    date &&
    format(
      parseISO(date),
      `${isThisYear(parseISO(date)) ? "dd MMM" : "dd MMM yyyy"} `
    );
  const { user } = jwtDecode(token) as IDecodedJwt;

  const [isDropDownVisible, setIsDropDownVisible] = useState(false);

  const navigate = useNavigate();

  const isPost = () => type === "post";

  useState(() => {
    setIsLiked(data.isLiked), [data];
  });

  const deletePostMutation = useMutation({
    mutationFn: isPost()
      ? fetcher.delete.deletePost
      : fetcher.delete.deleteComment,
    onSuccess: (response, variables) => {
      if (!response.ok) {
        throw new Error(`Something went wrong during ${type} deleting`);
      }

      isPost()
        ? onSuccess.deletePost(variables)
        : onSuccess.deleteComment(variables);
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: fetcher.put.toggleLike,
    onSuccess: async (response, variables) => {
      if (!response.ok) {
        throw new Error(`Something went wrong during ${type} like`);
      }
      setLikes((prevLikes: number) => {
        return variables.likeAction === "remove"
          ? prevLikes - 1
          : prevLikes + 1;
      });
      setIsLiked(!isLiked);

      if (isPost()) {
        await Promise.all(
          [postKeys.all, "post"].map((key) =>
            queryClient.invalidateQueries({
              queryKey: [key],
              exact: false,
              refetchType: "all",
            })
          )
        );
      } else {
        await queryClient.invalidateQueries({
          queryKey: commentKeys.all,
          exact: false,
          refetchType: "all",
        });
      }
    },
  });

  const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDropDownVisible(!isDropDownVisible);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deletePostMutation.mutate({ _id, token });
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    navigate(`/${createdBy.userName}`);
  };

  const handleLikeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    toggleLikeMutation.mutate({ _id, token, type, likeAction });
  };

  return (
    <div className={cl.postCard}>
      <div className={cl.avatarContainer} onClick={handleNavLinkClick}>
        <img src={createdBy.image} />
      </div>

      <div className={cl.content}>
        <div className={cl.meta}>
          <div className={cl.name} onClick={handleNavLinkClick}>
            {createdBy.name}
          </div>
          <div className={cl.userName} onClick={handleNavLinkClick}>
            @{createdBy.userName}
          </div>

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
          <button className={likeButtonClass} onClick={handleLikeToggle}>
            Likes {likes}
          </button>
          {isPost() && (
            <button className={cl.comment}>Comments {comments}</button>
          )}
        </div>
      </div>
    </div>
  );
}
