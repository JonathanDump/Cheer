import CreatePostOrCommentForm from "../../components/CreatePostForm/CreatePostOrCommentForm";
import cl from "./Home.module.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { useRef } from "react";
import loadPostsOnScroll from "../../helpers/functions/loadPostsOnScroll";
import getNextPageParam from "../../helpers/functions/getNextPageParam";
import PostsList from "../../components/PostsList/PostsList";

export default function Home() {
  const token = localStorage.getItem("token")!;
  const homeRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["home posts"],
      queryFn: async ({ pageParam = 0 }) =>
        await fetcher.get.getPosts({ pageParam, token }),
      getNextPageParam: getNextPageParam,
    });
  console.log("isLoading", isLoading);

  if (isLoading) {
    return (
      <div className={cl.home}>
        <div>Loading</div>
      </div>
    );
  }

  return (
    <div
      className={cl.home}
      onScroll={() =>
        loadPostsOnScroll(
          homeRef,
          isFetchingNextPage,
          hasNextPage,
          fetchNextPage
        )
      }
      ref={homeRef}
    >
      <CreatePostOrCommentForm type={"post"} />
      <PostsList data={data} isFetchingNextPage={isFetchingNextPage} />
    </div>
  );
}
