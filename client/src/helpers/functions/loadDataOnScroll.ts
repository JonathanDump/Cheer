import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

const loadDataOnScroll = (
  divRef: React.MutableRefObject<HTMLDivElement | null>,
  isFetchingNextPage: boolean,
  hasNextPage: boolean | undefined,
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<any, unknown>> //eslint-disable-line
) => {
  const { scrollHeight, scrollTop, clientHeight } = divRef.current!;
  const pxToEnd = scrollHeight - scrollTop - clientHeight;

  if (pxToEnd <= 50 && !isFetchingNextPage && hasNextPage) {
    fetchNextPage();
  }
};

export default loadDataOnScroll;
