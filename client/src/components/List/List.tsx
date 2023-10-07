import { IPost, IListParams, IUser } from "../../interfaces/interfaces";
import PostOrCommentCard from "../PostOrCommentCard/PostOrCommentCard";
import UserCard from "../UserCard/UserCard";
import cl from "./List.module.scss";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

export default function List({ data, isFetchingNextPage, type }: IListParams) {
  console.log("data", data);

  // if (type === "users") {
  //   return (
  //     <div className={cl.postsList}>
  //       {data?.pages.length &&
  //         data.pages.map((page, i) => (
  //           <Fragment key={i}>
  //             {page.users.map((user: IUser) => (
  //               <NavLink
  //                 to={`/${user.userName}`}
  //                 key={user._id}
  //                 className={cl.link}
  //               >
  //                 <UserCard user={user} />
  //               </NavLink>
  //             ))}
  //           </Fragment>
  //         ))}
  //       <div>{isFetchingNextPage ? "Loading more..." : null}</div>
  //     </div>
  //   );
  // }

  return (
    <div className={cl.postsList}>
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
                    <NavLink
                      to={`/${obj.createdBy.userName}/${obj._id}`}
                      key={obj._id}
                      className={cl.link}
                    >
                      <PostOrCommentCard data={obj} type="post" />
                    </NavLink>
                  );
                }
              } else if (isIUser(obj)) {
                return (
                  <NavLink
                    to={`/${obj.userName}`}
                    key={obj._id}
                    className={cl.link}
                  >
                    <UserCard user={obj} />
                  </NavLink>
                );
              }
            })}
          </Fragment>
        ))}
      <div>{isFetchingNextPage ? "Loading more..." : null}</div>
    </div>
  );

  // return (
  //   <div className={cl.postsList}>
  //     {data?.pages[0] &&
  //       data.pages.map((page: any, i: number) => (
  //         <Fragment key={i}>
  //           {page.posts.map((post: IPost) => {
  //             if (type === "posts") {
  //               return (
  //                 <NavLink
  //                   to={`/${post.createdBy.userName}/${post._id}`}
  //                   key={post._id}
  //                   className={cl.link}
  //                 >
  //                   <PostOrCommentCard data={post} type="post" />
  //                 </NavLink>
  //               );
  //             }
  //             if (type === "comments") {
  //               return <PostOrCommentCard data={post} type="comment" />;
  //             }
  //           })}
  //         </Fragment>
  //       ))}
  //     <div>{isFetchingNextPage ? "Loading more..." : null}</div>
  //   </div>
  // );
}

function isIPost(obj: any): obj is IPost {
  return "text" in obj && "createdBy" in obj;
}

function isIUser(obj: any): obj is IUser {
  return "name" in obj && "userName" in obj;
}
