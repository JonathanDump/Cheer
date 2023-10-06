//eslint-disable-next-line
export default function (page: any) {
  console.log("page", page);

  return page?.currentPage === page?.lastPage
    ? undefined
    : page.currentPage + 1;
}
