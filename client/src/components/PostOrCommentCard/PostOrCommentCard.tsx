import { format, isThisYear, parseISO } from "date-fns";
import {
  IDecodedJwt,
  IPostOrCommentCardProps,
} from "../../interfaces/interfaces";
import cl from "./PostOrCard.module.scss";
import { useRef, useState } from "react";
import jwtDecode from "jwt-decode";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { useNavigate } from "react-router-dom";
import { onSuccess } from "../../helpers/functions/onSuccess/onSuccess";
import { queryClient } from "../../config/config";
import { commentKeys, postKeys } from "../../config/queryKeys";
import { ReactComponent as LikeIcon } from "../../icons/like.svg";
import { ReactComponent as CommentsIcon } from "../../icons/comments.svg";
import { ReactComponent as DotsIcon } from "../../icons/dots.svg";

export default function PostOrCommentCard({
  data,
  type,
  link,
}: IPostOrCommentCardProps) {
  const { _id, text, images, date, comments, createdBy } = data;
  const [likes, setLikes] = useState(data.likes);
  const [isLiked, setIsLiked] = useState(data.isLiked);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const dropDownContainerRef = useRef<HTMLDivElement | null>(null);

  const likeButtonClass = isLiked ? `${cl.like} ${cl.liked}` : `${cl.like}`;
  const cardClass =
    type === "post" ? `${cl.card} ${cl.post}` : `${cl.card} ${cl.comment}`;

  const likeAction = isLiked ? "remove" : "set";

  const token = getItemFromLocalStorage<string>("token");
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

  const hideDropDown = () => {
    dropDownContainerRef.current?.classList.add(`${cl.hideDropDown}`);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("bg");
    e.stopPropagation();
    hideDropDown();
    setTimeout(() => setIsDropDownVisible(!isDropDownVisible), 150);
  };

  const handleCardClick = () => {
    if (!link) {
      return;
    }

    navigate(link);
  };

  const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setIsDropDownVisible(!isDropDownVisible);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("delete");
    deletePostMutation.mutate({ _id, token });
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/${createdBy.userName}`);
  };

  const handleLikeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleLikeMutation.mutate({ _id, token, type, likeAction });
  };

  return (
    <div className={cardClass} ref={cardRef} onClick={handleCardClick}>
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
              <button
                className={cl.dots}
                type="button"
                onClick={handleSettingsClick}
              >
                <DotsIcon />
              </button>
              {isDropDownVisible && (
                <div className={cl.dropDown}>
                  <div
                    className={cl.background}
                    onClick={handleBackgroundClick}
                  ></div>
                  <div className={cl.container} ref={dropDownContainerRef}>
                    <button
                      type="button"
                      className={cl.delete}
                      onClick={handleDeleteClick}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={cl.text}>{text}</div>
        {!!images.length && (
          <div className={cl.images}>
            {images.map((img) => (
              <img src={img}></img>
            ))}
          </div>
        )}
        <div className={cl.actions}>
          {isPost() && (
            <button className={cl.comment}>
              <CommentsIcon /> {comments}
            </button>
          )}
          <button className={likeButtonClass} onClick={handleLikeToggle}>
            <LikeIcon />
            {likes}
          </button>
        </div>
      </div>
    </div>
  );
}
