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
import { useNavigate, useParams } from "react-router-dom";
import { onSuccess } from "../../helpers/functions/onSuccess/onSuccess";

export default function PostOrCommentCard({
  data,
  type,
}: IPostOrCommentCardProps) {
  const { _id, text, images, date, likes, comments, createdBy } = data;

  const token = getItemFromLocalStorage("token") as string;
  const formattedDate =
    date &&
    format(
      parseISO(date),
      `${isThisYear(parseISO(date)) ? "dd MMM" : "dd MMM yyyy"} `
    );
  const { user } = jwtDecode(token) as IDecodedJwt;

  const [isDropDownVisible, setIsDropDownVisible] = useState(false);

  const { userName } = useParams();

  const navigate = useNavigate();

  const isPost = () => type === "post";

  const deletePostMutation = useMutation({
    mutationFn: isPost()
      ? fetcher.delete.deletePost
      : fetcher.delete.deleteComment,
    onSuccess: (response, variables) => {
      if (!response.ok) {
        throw new Error(`Something went wrong during ${type} deleting`);
      }

      isPost()
        ? onSuccess.deletePost(variables, userName)
        : onSuccess.deleteComment(variables);
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
          <button className={cl.like}>Likes {likes}</button>
          {isPost() && (
            <button className={cl.comment}>Comments {comments}</button>
          )}
        </div>
      </div>
    </div>
  );
}
