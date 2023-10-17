export default function (page: any) {
  return page?.currentPage === page?.lastPage
    ? undefined
    : page.currentPage + 1;
}
