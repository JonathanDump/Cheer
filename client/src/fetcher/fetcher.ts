import { SERVER_URL } from "../config/config";
import { ICreatePostFormValues } from "../interfaces/interfaces";

const createPost = async ({
  formData,
  token,
}: {
  formData: FormData;
  token: string;
}) => {
  return fetch(`${SERVER_URL}/cheer/create-post`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: formData,
  });
};

// const createPost = async ({
//   body,
//   token,
// }: {
//   body: ICreatePostFormValues;
//   token: string;
// }) => {
//   return fetch(`${SERVER_URL}/cheer/create-post`, {
//     method: "POST",
//     headers: {
//       Authorization: token,
//       "Content-Type": "multipart/form-data",
//     },
//     body: JSON.stringify(body),
//   });
// };

export const fetcher = {
  get: {},
  post: {
    createPost,
  },
};
