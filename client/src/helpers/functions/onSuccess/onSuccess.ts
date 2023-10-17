import { queryClient } from "../../../config/config";
import { commentKeys, postKeys } from "../../../config/queryKeys";
import { IPost, IUser } from "../../../interfaces/interfaces";
import getObjectCopy from "../getObjectCopy";

const postCreate = async ({
  data,
  user,
}: {
  data: Response;
  userName: string | undefined;
  user: IUser;
}) => {
  const result: IPost = await data.json();
  result.createdBy = user;
  

  queryClient.setQueriesData(postKeys.all, (oldData: unknown) => {
    if (oldData) {
      const copyOldData = getObjectCopy(oldData);
      if (!copyOldData.pages[0]) {
        copyOldData.pages[0] = { posts: [result] };
      }
      copyOldData.pages[0].posts.unshift(result);
      return copyOldData;
    }
    return oldData;
  });
};

const commentCreate = async ({
  data,
  user,
}: {
  data: Response;
  user: IUser;
}) => {
  const result: IPost = await data.json();
  result.createdBy = user;
  

  queryClient.setQueriesData(commentKeys.all, (oldData: unknown) => {
    if (oldData) {
      const copyOldData = getObjectCopy(oldData);
      if (!copyOldData.pages[0]) {
        copyOldData.pages[0] = { comments: [result] };
      }
      copyOldData.pages[0].comments.push(result);
      return copyOldData;
    }
    return oldData;
  });

  queryClient.setQueriesData(["post"], (oldData: any) => {
    if (oldData) {
      const newData = { ...oldData, comments: oldData.comments + 1 };
      return newData;
    }
    return oldData;
  });
};

const deletePost = (variables: { _id: string; token: string }) => {
  queryClient.setQueriesData(postKeys.all, (oldData: unknown) => {
    if (oldData) {
      const copyOldData = getObjectCopy(oldData);
      copyOldData.pages[0].posts = copyOldData.pages[0].posts.filter(
        (post: IPost) => post._id !== variables._id
      );
      return copyOldData;
    }
    return oldData;
  });
};
const deleteComment = (variables: { _id: string; token: string }) => {
  queryClient.setQueriesData(commentKeys.all, (oldData: unknown) => {
    if (oldData) {
      const copyOldData = getObjectCopy(oldData);
      copyOldData.pages[0].comments = copyOldData.pages[0].comments.filter(
        (comment: IPost) => comment._id !== variables._id
      );
      return copyOldData;
    }
    return oldData;
  });
};

export const onSuccess = {
  postCreate,
  commentCreate,
  deletePost,
  deleteComment,
};
