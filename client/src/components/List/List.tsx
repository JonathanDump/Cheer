import { IPost, IListParams, IUser } from "../../interfaces/interfaces";
import PostOrCommentCard from "../PostOrCommentCard/PostOrCommentCard";
import UserCard from "../UserCard/UserCard";
import cl from "./List.module.scss";
import { Fragment } from "react";

export default function List({ data, isFetchingNextPage, type }: IListParams) {
  console.log("data", data);

  return (
    <div className={cl.list}>
      {data?.pages[0] &&
        data.pages.map((page: any, i: number) => (
          <Fragment key={i}>
            {page[type].map((obj: IPost | IUser) => {
              if (isIPost(obj)) {
                if (type === "comments") {
                  return (
                    <PostOrCommentCard
                      key={obj._id}
                      data={obj}
                      type="comment"
                    />
                  );
                }
                if (type === "posts") {
                  return (
                    <PostOrCommentCard
                      key={obj._id}
                      data={obj}
                      type="post"
                      link={`/${obj.createdBy.userName}/${obj._id}`}
                    />
                  );
                }
              } else if (isIUser(obj)) {
                return (
                  <UserCard
                    key={obj._id}
                    user={obj}
                    link={`/${obj.userName}`}
                  />
                );
              }
            })}
          </Fragment>
        ))}
      <div>{isFetchingNextPage ? "Loading more..." : null}</div>
    </div>
  );
}

function isIPost(obj: any): obj is IPost {
  return "text" in obj && "createdBy" in obj;
}

function isIUser(obj: any): obj is IUser {
  return "name" in obj && "userName" in obj;
}
