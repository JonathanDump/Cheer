import { NavLink, useLocation, useParams } from "react-router-dom";
import cl from "./FollowersList.module.scss";
import List from "../../components/List/List";
import { useInfiniteQuery } from "@tanstack/react-query";
import { userKeys } from "../../config/queryKeys";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import { fetcher } from "../../helpers/fetcher/fetcher";
import loadDataOnScroll from "../../helpers/functions/loadDataOnScroll";
import { useRef } from "react";

export default function FollowersList() {
  const { userName } = useParams();
  const token = getItemFromLocalStorage<string>("token");
  const followersListRef = useRef<HTMLDivElement | null>(null);
  const fnKey = useLocation().pathname.split("/")[2] as
    | "followers"
    | "following";

  const key = (fnKey + "Filter") as "followersFilter" | "followingFilter";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: userKeys[key](token, userName!),
    queryFn: ({ pageParam = 0, queryKey }) => {
      const [, token, userName] = queryKey;
      return fetcher.get[fnKey]({
        token,
        userName,
        pageParam,
      });
    },
    getNextPageParam: (page) => {
      return page.currentPage === page.lastPage
        ? undefined
        : page.currentPage + 1;
    },
  });

  return (
    <div
      ref={followersListRef}
      className={cl.followersList}
      onScroll={() =>
        loadDataOnScroll(
          followersListRef,
          isFetchingNextPage,
          hasNextPage,
          fetchNextPage
        )
      }
    >
      <div className={cl.navigation}>
        <NavLink
          to={`/${userName}/following`}
          className={({ isActive }) =>
            isActive ? `${cl.navLink} navActive` : "cl.navLink"
          }
        >
          Following
        </NavLink>
        <NavLink
          to={`/${userName}/followers`}
          className={({ isActive }) =>
            isActive ? `${cl.navLink} navActive` : "cl.navLink"
          }
        >
          Followers
        </NavLink>
      </div>
      {isLoading ? (
        "Loading"
      ) : isError ? (
        "Something went wrong"
      ) : (
        <List
          data={data}
          type="users"
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </div>
  );
}
