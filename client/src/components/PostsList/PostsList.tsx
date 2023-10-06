import { IPost, IPostsListParams } from "../../interfaces/interfaces";
import PostCard from "../PostCard/PostCard";
import cl from "./PostsList.module.scss";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

export default function PostsList({
  data,
  isFetchingNextPage,
}: IPostsListParams) {
  console.log("data", data);

  return (
    <div className={cl.postsList}>
      {data?.pages[0] &&
        data.pages.map((page: any, i: number) => (
          <Fragment key={i}>
            {page.posts.map((post: IPost) => (
              <NavLink
                to={`/${post.createdBy.userName}/${post._id}`}
                key={post._id}
                className={cl.link}
              >
                <PostCard post={post} />
              </NavLink>
            ))}
          </Fragment>
        ))}
      <div>{isFetchingNextPage ? "Loading more..." : null}</div>
    </div>
  );
}
