import { useMutation } from "@tanstack/react-query";
import { IUser, IUserCardProps } from "../../interfaces/interfaces";
import cl from "./UserCard.module.scss";
import { fetcher } from "../../helpers/fetcher/fetcher";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";

import { useState } from "react";

export default function UserCard({ user }: IUserCardProps) {
  const { _id, image, name, userName, bio, followers } = user;
  const [isFollowed, setIsFollowed] = useState(!!followers);
  const token = getItemFromLocalStorage<string>("token");
  const userStorage = getItemFromLocalStorage<IUser>("user");
  const followAction = isFollowed ? "Unfollow" : "Follow";

  const isMyCard = _id === userStorage._id;

  const followMutation = useMutation({
    mutationFn: fetcher.put.toggleFollow,
    onSuccess(data) {
      if (!data.ok) {
        throw new Error(`Something went wrong during ${followAction}`);
      }
      setIsFollowed(!isFollowed);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleFollowClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    followMutation.mutate({ userId: _id, token, followAction });
  };
  return (
    <div className={cl.userCard}>
      <div className={cl.imageContainer}>
        <img src={image} alt="" />
      </div>
      <div className={cl.main}>
        <div className={cl.userMeta}>
          <div className={cl.nameContainer}>
            <div className={cl.name}>{name}</div>
            <div className={cl.userName}>@{userName}</div>
          </div>
          {!isMyCard && (
            <button type="button" onClick={handleFollowClick}>
              {followAction}
            </button>
          )}
        </div>
        {bio && <div className={cl.bio}>{bio}</div>}
      </div>
    </div>
  );
}
