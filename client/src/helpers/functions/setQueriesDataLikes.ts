import { IPost, IToggleLikePostVariables } from "../../interfaces/interfaces";
import getObjectCopy from "./getObjectCopy";

export default function setQueriesDataLikes({
  variables,
  oldData,
}: {
  variables: IToggleLikePostVariables;
  oldData: unknown;
}) {
  if (!oldData) {
    return oldData;
  }
  const copyOldData = getObjectCopy(oldData);
  copyOldData.pages.some((page: IPost[]) => {
    const post = page.find((post) => post._id === variables._id);
    if (!post) {
      return false;
    }

    if (variables.type === "remove") {
      post.isLiked = false;
      post.likes -= 1;
    } else {
      post.isLiked = true;
      post.likes += 1;
    }
    return true;
  });
  return copyOldData;
}
