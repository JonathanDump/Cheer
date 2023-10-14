import { NavLink, useNavigate, useParams } from "react-router-dom";
import { IUserInfoParams } from "../../interfaces/interfaces";
import cl from "./UserInfo.module.scss";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "../../helpers/fetcher/fetcher";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import { queryClient } from "../../config/config";
import { userKeys } from "../../config/queryKeys";

export default function UserInfo({ user, isMyProfile }: IUserInfoParams) {
  const [isFollowed, setIsFollowed] = useState(user.isFollowed);
  const [followers, setFollowers] = useState(user.followers);
  const followAction = isFollowed ? "Unfollow" : "Follow";
  const navigate = useNavigate();

  const token = getItemFromLocalStorage<string>("token");
  const userName = useParams().userName as string;

  useEffect(() => {
    console.log("followers", followers);
  }, [followers]);

  const followMutation = useMutation({
    mutationFn: fetcher.put.toggleFollow,
    onSuccess: async (data) => {
      if (!data.ok) {
        throw new Error(`Something went wrong during ${followAction}`);
      }
      console.log("success");

      setIsFollowed(!isFollowed);
      setFollowers((prev) => {
        if (typeof prev === "undefined") {
          return prev;
        }

        return followAction === "Follow" ? prev + 1 : prev - 1;
      });
      await queryClient.invalidateQueries({
        queryKey: userKeys.user,
        exact: false,
        refetchType: "all",
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleFollowClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    followMutation.mutate({ userId: user._id, token, followAction });
  };

  const handleEditProfileClick = () => {
    navigate("/edit");
  };

  return (
    <div className={cl.userInfo}>
      <div className={cl.imageButton}>
        <div className={cl.avatarContainer}>
          <img src={user.image} />
        </div>
        {isMyProfile ? (
          <button type="button" onClick={handleEditProfileClick}>
            Edit profile
          </button>
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
        <NavLink to={`/${userName}/followers`}>Followers {followers}</NavLink>
      </div>
    </div>
  );
}
