import { useMutation } from "@tanstack/react-query";
import { IUser, IUserCardProps } from "../../interfaces/interfaces";
import cl from "./UserCard.module.scss";
import { fetcher } from "../../helpers/fetcher/fetcher";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import { queryClient } from "../../config/config";
import getObjectCopy from "../../helpers/functions/getObjectCopy";

export default function UserCard({ user }: IUserCardProps) {
  const { _id, image, name, userName, bio, followers } = user;
  const token = getItemFromLocalStorage("token") as string;
  const followAction = followers?.length ? "Unfollow" : "Follow";
  // console.log("user", user);

  const followMutation = useMutation({
    mutationFn: fetcher.put.toggleFollow,
    onSuccess(data, variables) {
      if (!data.ok) {
        throw new Error(`Something went wrong during ${followAction}`);
      }

      if (data.status == 200) {
        queryClient.setQueriesData(["all users"], (oldData: unknown) => {
          if (oldData) {
            const copyOldData = getObjectCopy(oldData);

            copyOldData.pages.some(
              (page: {
                users: IUser[];
                currentPage: number;
                lastPage: number;
              }) => {
                const oldUser = page.users.find(
                  (user) => user._id === variables.userId
                );
                if (oldUser) {
                  variables.followAction === "Follow"
                    ? oldUser.followers?.push(_id)
                    : oldUser.followers?.pop();

                  return true;
                }
                return false;
              }
            );
            return copyOldData;
          }
          return oldData;
        });
      }
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
          <button type="button" onClick={handleFollowClick}>
            {followAction}
          </button>
        </div>
        {bio && <div className={cl.bio}>{bio}</div>}
      </div>
    </div>
  );
}
