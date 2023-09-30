import { SERVER_URL } from "../config/config";

const createPost = async ({
  formData,
  token,
}: {
  formData: FormData;
  token: string;
}) => {
  return fetch(`${SERVER_URL}/create-post`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: formData,
  });
};

export const fetcher = {
  get: {},
  post: {
    createPost,
  },
};
