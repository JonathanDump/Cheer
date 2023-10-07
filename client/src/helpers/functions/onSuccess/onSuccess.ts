import { queryClient } from "../../../config/config";
import { IPost, IUser } from "../../../interfaces/interfaces";
import getObjectCopy from "../getObjectCopy";

const post = async ({
  data,
  userName,
  user,
}: {
  data: Response;
  userName: string | undefined;
  user: IUser;
}) => {
  const result: IPost = await data.json();
  result.createdBy = user;
  console.log("result ", result);

  const key = userName ? "user posts" : "home posts";
  queryClient.setQueriesData([key], (oldData: unknown) => {
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

const comment = async ({ data, user }: { data: Response; user: IUser }) => {
  const result: IPost = await data.json();
  result.createdBy = user;
  console.log("result ", result);

  queryClient.setQueriesData(["comments"], (oldData: unknown) => {
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

export const onSuccess = {
  post,
  comment,
};
