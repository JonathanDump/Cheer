import { SERVER_URL } from "../../config/config";

//GET
const getPosts = async ({
  pageParam = 0,
  token,
}: {
  pageParam: any; // eslint-disable-line  @typescript-eslint/no-explicit-any
  token: string;
}) => {
  const response = await fetch(
    `${SERVER_URL}/cheer/get-posts?cursor=${pageParam}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Couldn't get posts");
  }
  console.log("fetch");

  return response.json();
};

//POST
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

const logIn = (data: FormData) => {
  return fetch(`${SERVER_URL}/log-in`, {
    method: "POST",
    body: data,
  });
};

//DELETE
const deletePost = ({ postId, token }: { postId: string; token: string }) => {
  return fetch(`${SERVER_URL}/cheer/${postId}/delete-post`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });
};

export const fetcher = {
  get: {
    getPosts,
  },
  post: {
    createPost,
    logIn,
  },
  delete: { deletePost },
};
