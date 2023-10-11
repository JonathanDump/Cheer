import { NavLink, useParams } from "react-router-dom";
import { IUserInfoParams } from "../../interfaces/interfaces";
import cl from "./UserInfo.module.scss";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "../../helpers/fetcher/fetcher";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";

export default function UserInfo({ user, isMyProfile }: IUserInfoParams) {
  const [isFollowed, setIsFollowed] = useState(user.isFollowed);
  const followAction = isFollowed ? "Unfollow" : "Follow";
  console.log("user", user);

  const token = getItemFromLocalStorage("token") as string;
  const userName = useParams().userName as string;

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
    followMutation.mutate({ userId: user._id, token, followAction });
  };

  return (
    <div className={cl.userInfo}>
      <div className={cl.imageButton}>
        <img src={user.image} />
        {isMyProfile ? (
          <NavLink to={"/edit"}>
            <button>Edit profile</button>
          </NavLink>
        ) : (
          <button type="button" onClick={handleFollowClick}>
            {followAction}
          </button>
        )}
      </div>
      <div className={cl.nameContainer}>
        <div className={cl.name}>{user.name}</div>
        <div className={cl.userName}>@{user.userName}</div>
        <div className={cl.bio}>{user.bio}</div>
      </div>
      <div className={cl.followersContainer}>
        <NavLink to={`/${userName}/following`}>
          Following {user.following}
        </NavLink>
        <NavLink to={`/${userName}/followers`}>
          Followers {user.followers}
        </NavLink>
      </div>
    </div>
  );
}
