import { useInfiniteQuery } from "@tanstack/react-query";
import cl from "./Users.module.scss";
import { fetcher } from "../../helpers/fetcher/fetcher";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import { Fragment, useRef } from "react";
import { NavLink } from "react-router-dom";
import { IUser } from "../../interfaces/interfaces";
import UserCard from "../../components/UserCard/UserCard";

export default function Users() {
  const token = getItemFromLocalStorage("token") as string;
  const usersRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["all users"],
      queryFn: ({ pageParam = 0 }) =>
        fetcher.get.getUsers({ pageParam, token }),
      getNextPageParam: (page) => {
        return page.currentPage === page.lastPage
          ? undefined
          : page.currentPage + 1;
      },
    });

  const loadUsersInScroll = () => {
    const { scrollHeight, scrollTop, clientHeight } = usersRef.current!;
    const pxToEnd = scrollHeight - scrollTop - clientHeight;

    if (pxToEnd <= 50 && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <div className={cl.users}>
        <div>Loading</div>
      </div>
    );
  }
  return (
    <div className={cl.users} ref={usersRef} onScroll={loadUsersInScroll}>
      {data?.pages.length &&
        data.pages.map((page, i) => (
          <Fragment key={i}>
            {page.users.map((user: IUser) => (
              <NavLink
                to={`/${user.userName}`}
                key={user._id}
                className={cl.link}
              >
                <UserCard user={user} />
              </NavLink>
            ))}
          </Fragment>
        ))}
      <div>{isFetchingNextPage ? "Loading more..." : null}</div>
    </div>
  );
}
