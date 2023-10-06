import { NavLink, useOutlet, useParams } from "react-router-dom";
import cl from "./UserProfile.module.scss";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import { IUser } from "../../interfaces/interfaces";
import CreatePostForm from "../../components/CreatePostForm/CreatePostForm";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { useRef } from "react";
import loadPostsOnScroll from "../../helpers/functions/loadPostsOnScroll";
import getNextPageParam from "../../helpers/functions/getNextPageParam";

import PostsList from "../../components/PostsList/PostsList";

export default function UserProfile() {
  const outlet = useOutlet();
  const userName = useParams().userName as string;

  const userFromStorage = getItemFromLocalStorage("user") as IUser;
  const token = getItemFromLocalStorage("token") as string;

  const userProfileRef = useRef<HTMLDivElement | null>(null);

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => await fetcher.get.getUser({ userName, token }),
  });

  const userId = userQuery.data?._id as string;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["user posts", { token, userId }],
      queryFn: async ({ pageParam = 0 }) =>
        await fetcher.get.getUserPosts({ token, pageParam, userId }),
      getNextPageParam: getNextPageParam,
      enabled: !!userId,
    });

  console.log("isLoading", isLoading);
  console.log("pr data", data);

  const isMyProfile = () => {
    return userName === userFromStorage.userName;
  };

  if (outlet) {
    return outlet;
  }

  if (userQuery.isFetching) {
    return <div className={cl.userProfile}>Loading...</div>;
  }

  return (
    <div
      className={cl.userProfile}
      ref={userProfileRef}
      onScroll={() =>
        loadPostsOnScroll(
          userProfileRef,
          isFetchingNextPage,
          hasNextPage,
          fetchNextPage
        )
      }
    >
      {userQuery.data && (
        <div className={cl.userInfo}>
          <div className={cl.imageButton}>
            <img src={userQuery.data.image} />
            {isMyProfile() ? (
              <button>Edit profile</button>
            ) : (
              <button>Follow</button>
            )}
          </div>
          <div className={cl.nameContainer}>
            <div className={cl.name}>{userQuery.data.name}</div>
            <div className={cl.userName}>@{userQuery.data.userName}</div>
            <div className={cl.bio}>{userQuery.data.bio}</div>
          </div>
          <div className={cl.followersContainer}>
            <NavLink to={`/${userName}/following`}>
              Following {userQuery.data.following}
            </NavLink>
            <NavLink to={`/${userName}/followers`}>
              Followers {userQuery.data.followers}
            </NavLink>
          </div>
        </div>
      )}
      <div className={cl.posts}>
        {isMyProfile() && <CreatePostForm />}
        {isLoading ? (
          <div>Loading posts</div>
        ) : (
          <PostsList data={data} isFetchingNextPage={isFetchingNextPage} />
        )}
      </div>
    </div>
  );
}
