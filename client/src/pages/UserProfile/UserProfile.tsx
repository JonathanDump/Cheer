import { useParams } from "react-router-dom";
import cl from "./UserProfile.module.scss";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import { IUser } from "../../interfaces/interfaces";
import CreatePostOrCommentForm from "../../components/CreatePostForm/CreatePostOrCommentForm";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { useRef } from "react";
import loadPostsOnScroll from "../../helpers/functions/loadDataOnScroll";
import getNextPageParam from "../../helpers/functions/getNextPageParam";
import List from "../../components/List/List";
import UserInfo from "../../components/UserInfo/UserInfo";
import { postKeys, userKeys } from "../../config/queryKeys";

export default function UserProfile() {
  const userName = useParams().userName as string;

  const userFromStorage = getItemFromLocalStorage<IUser>("user");
  const token = getItemFromLocalStorage<string>("token");

  const userProfileRef = useRef<HTMLDivElement | null>(null);

  const userQuery = useQuery({
    queryKey: userKeys.user,
    queryFn: async () => await fetcher.get.getUser({ userName, token }),
  });

  const userId = userQuery.data?._id as string;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: postKeys.user({ token, userId }),
      queryFn: async ({ pageParam = 0 }) =>
        await fetcher.get.getUserPosts({ token, pageParam, userId }),
      getNextPageParam: getNextPageParam,
      enabled: !!userId,
    });

  const isMyProfile = () => {
    return userName === userFromStorage.userName;
  };

  if (userQuery.isLoading) {
    return <div className={cl.userProfile}>Loading...</div>;
  }

  if (userQuery.isError) {
    return <div className={cl.userProfile}>Something went wrong...</div>;
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
      <UserInfo user={userQuery.data} isMyProfile={isMyProfile()} />
      <div className={cl.posts}>
        {isMyProfile() && <CreatePostOrCommentForm type={"post"} />}
        {isLoading ? (
          <div>Loading posts</div>
        ) : (
          <List
            data={data}
            isFetchingNextPage={isFetchingNextPage}
            type="posts"
          />
        )}
      </div>
    </div>
  );
}
