import { SERVER_URL } from "../../config/config";
import { IUser } from "../../interfaces/interfaces";
import getItemFromLocalStorage from "../functions/getItemFromLocalStorage";

//GET
const getPosts = async ({
  pageParam,
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

const getUsers = async ({
  pageParam,
  token,
}: {
  pageParam: any; // eslint-disable-line  @typescript-eslint/no-explicit-any
  token: string;
}) => {
  const response = await fetch(
    `${SERVER_URL}/cheer/get-users?cursor=${pageParam}`,
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

const setUserName = (userName: string) => {
  const user = getItemFromLocalStorage("user") as IUser;
  return fetch(`${SERVER_URL}/sign-up/set-user-name`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName,
      userId: user._id,
    }),
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

const toggleFollow = ({
  userId,
  token,
  followAction,
}: {
  userId: string;
  token: string;
  followAction: string;
}) => {
  console.log("followAction", followAction);

  return fetch(
    `${SERVER_URL}/cheer/${followAction.toLocaleLowerCase()}?userId=${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: token,
      },
    }
  );
};

export const fetcher = {
  get: {
    getPosts,
    getUsers,
  },
  post: {
    createPost,
    logIn,
    setUserName,
  },
  delete: { deletePost },
  put: { toggleFollow },
};