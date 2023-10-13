import { useInfiniteQuery } from "@tanstack/react-query";
import cl from "./Users.module.scss";
import { fetcher } from "../../helpers/fetcher/fetcher";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import { useRef } from "react";
import List from "../../components/List/List";
import { userKeys } from "../../config/queryKeys";

export default function Users() {
  const token = getItemFromLocalStorage<string>("token");
  const usersRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: userKeys.allUsersToken(token),
      queryFn: ({ pageParam = 0, queryKey }) => {
        const token = queryKey[1];
        return fetcher.get.getUsers({ pageParam, token });
      },
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
      <List isFetchingNextPage={isFetchingNextPage} data={data} type="users" />
    </div>
  );
}
