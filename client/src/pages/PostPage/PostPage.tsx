import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import cl from "./PostPage.module.scss";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { useParams } from "react-router-dom";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import CreatePostOrCommentForm from "../../components/CreatePostForm/CreatePostOrCommentForm";
import PostOrCommentCard from "../../components/PostOrCommentCard/PostOrCommentCard";
import List from "../../components/List/List";
import getNextPageParam from "../../helpers/functions/getNextPageParam";
import loadDataOnScroll from "../../helpers/functions/loadPostsOnScroll";
import { useRef } from "react";

export default function PostPage() {
  const postId = useParams().postId as string;
  const token = getItemFromLocalStorage("token") as string;

  const postPageRef = useRef<HTMLDivElement | null>(null);

  const postQuery = useQuery({
    queryKey: ["post"],
    queryFn: async () => await fetcher.get.getPost({ postId, token }),
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["comments"],
      queryFn: async ({ pageParam = 0 }) =>
        await fetcher.get.getComments({ postId, token, pageParam }),
      getNextPageParam: getNextPageParam,
    });

  if (postQuery.isLoading) {
    return <div className={cl.postPage}>Loading...</div>;
  }
  if (postQuery.isError) {
    return <div className={cl.postPage}>Something went wrong</div>;
  }

  return (
    <div
      ref={postPageRef}
      className={cl.postPage}
      onScroll={() =>
        loadDataOnScroll(
          postPageRef,
          isFetchingNextPage,
          hasNextPage,
          fetchNextPage
        )
      }
    >
      <PostOrCommentCard data={postQuery.data} type="post" />
      <CreatePostOrCommentForm type={"comment"} />
      {isLoading ? (
        "Loading..."
      ) : (
        <List
          type="comments"
          isFetchingNextPage={isFetchingNextPage}
          data={data}
        />
      )}
    </div>
  );
}
