import CreatePostOrCommentForm from "../../components/CreatePostOrCommentForm/CreatePostOrCommentForm";
import cl from "./Home.module.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { useRef } from "react";
import loadDataOnScroll from "../../helpers/functions/loadDataOnScroll";
import getNextPageParam from "../../helpers/functions/getNextPageParam";
import List from "../../components/List/List";
import { postKeys } from "../../config/queryKeys";

export default function Home() {
  const token = localStorage.getItem("token")!;
  const homeRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: postKeys.home(token),
      queryFn: async ({ pageParam = 0 }) =>
        await fetcher.get.getPosts({ pageParam, token }),
      getNextPageParam: getNextPageParam,
    });

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
        loadDataOnScroll(
          homeRef,
          isFetchingNextPage,
          hasNextPage,
          fetchNextPage
        )
      }
      ref={homeRef}
    >
      <CreatePostOrCommentForm type={"post"} />
      <List data={data} isFetchingNextPage={isFetchingNextPage} type="posts" />
    </div>
  );
}
