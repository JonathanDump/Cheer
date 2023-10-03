import CreatePostForm from "../../components/CreatePostForm/CreatePostForm";
import cl from "./Home.module.scss";
import { IPost } from "../../interfaces/interfaces";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "../../helpers/fetcher/fetcher";
import PostCard from "../../components/PostCard/PostCard";
import { Fragment, useRef } from "react";
import { NavLink } from "react-router-dom";
export default function Home() {
  const token = localStorage.getItem("token")!;
  const homeRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["home posts"],
      queryFn: ({ pageParam = 0 }) =>
        fetcher.get.getPosts({ pageParam, token }),
      getNextPageParam: (page) => {
        return page.currentPage === page.lastPage
          ? undefined
          : page.currentPage + 1;
      },
    });
  const loadPostsOnScroll = () => {
    const { scrollHeight, scrollTop, clientHeight } = homeRef.current!;
    const pxToEnd = scrollHeight - scrollTop - clientHeight;

    if (pxToEnd <= 50 && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <div className={cl.home}>
        <div>Loading</div>
      </div>
    );
  }

  return (
    <div className={cl.home} onScroll={loadPostsOnScroll} ref={homeRef}>
      <CreatePostForm />
      <div className={cl.postsList}>
        {data?.pages.length &&
          data.pages.map((page, i) => (
            <Fragment key={i}>
              {page.posts.map((post: IPost) => (
                <NavLink
                  to={`/${post.createdBy.userName}/${post._id}`}
                  key={post._id}
                >
                  <PostCard post={post} />
                </NavLink>
              ))}
            </Fragment>
          ))}

        <div>{isFetchingNextPage ? "Loading more..." : null}</div>
      </div>
    </div>
  );
}
