import { SERVER_URL } from "../../config/config";
import { IPost, IPostsPage, IUser } from "../../interfaces/interfaces";
import getItemFromLocalStorage from "../functions/getItemFromLocalStorage";

//GET
const getPosts = async ({
  pageParam,
  token,
}: {
  pageParam: any; // eslint-disable-line  @typescript-eslint/no-explicit-any
  token: string;
}): Promise<IPostsPage> => {
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

  return response.json();
};

const getUserPosts = async ({
  pageParam,
  token,
  userId,
}: {
  pageParam: any; // eslint-disable-line  @typescript-eslint/no-explicit-any
  token: string;
  userId: string;
}): Promise<IPostsPage> => {
  const response = await fetch(
    `${SERVER_URL}/cheer/get-user-posts?cursor=${pageParam}&userId=${userId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Couldn't get posts");
  }

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

  return response.json();
};

const getUser = async ({
  userName,
  token,
}: {
  userName: string;
  token: string;
}): Promise<IUser> => {
  const response = await fetch(
    `${SERVER_URL}/cheer/get-user?userName=${userName}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Couldn't get posts");
  }

  return response.json();
};

const getPost = async ({
  postId,
  token,
}: {
  postId: string;
  token: string;
}): Promise<IPost> => {
  const response = await fetch(
    `${SERVER_URL}/cheer/get-post?postId=${postId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Couldn't get posts");
  }

  return response.json();
};

const getComments = async ({
  postId,
  token,
  pageParam,
}: {
  postId: string;
  token: string;
  pageParam: string;
}): Promise<IPost[]> => {
  const response = await fetch(
    `${SERVER_URL}/cheer/get-comments?cursor=${pageParam}&postId=${postId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Couldn't get comments");
  }

  return response.json();
};

const isUserNameExists = async (userName: string) => {
  const response = await fetch(
    `${SERVER_URL}/check-user-name?userName=${userName}`
  );
  if (!response.ok) {
    throw new Error("Couldn't validate user name");
  }
  return response.json();
};

const followers = async ({
  token,
  userName,
  pageParam,
}: {
  token: string;
  userName: string;
  pageParam: string;
}) => {
  const response = await fetch(
    `${SERVER_URL}/cheer/get-followers?userName=${userName}&cursor=${pageParam}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Couldn't get followers");
  }
  return response.json();
};

const following = async ({
  token,
  userName,
  pageParam,
}: {
  token: string;
  userName: string;
  pageParam: string;
}) => {
  const response = await fetch(
    `${SERVER_URL}/cheer/get-following?userName=${userName}&cursor=${pageParam}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Couldn't get following");
  }
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
  const user = getItemFromLocalStorage<IUser>("user");
  return fetch(`${SERVER_URL}/sign-up/set-user-name`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName,
      userId: user._id,
    }),
  });
};

const createComment = async ({
  formData,
  token,
}: {
  formData: FormData;
  token: string;
}) => {
  return fetch(`${SERVER_URL}/cheer/create-comment`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: formData,
  });
};

//DELETE
const deletePost = ({ _id, token }: { _id: string; token: string }) => {
  return fetch(`${SERVER_URL}/cheer/${_id}/delete-post`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });
};

const deleteComment = ({ _id, token }: { _id: string; token: string }) => {
  return fetch(`${SERVER_URL}/cheer/${_id}/delete-comment`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });
};

//PUT
const toggleFollow = ({
  userId,
  token,
  followAction,
}: {
  userId: string;
  token: string;
  followAction: string;
}) => {
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

const toggleLike = ({
  _id,
  token,
  type,
  likeAction,
}: {
  _id: string;
  token: string;
  type: string;
  likeAction: string;
}) => {
  return fetch(
    `${SERVER_URL}/cheer/${type}-${likeAction}-like?${type}Id=${_id}`,
    {
      method: "PUT",
      headers: {
        Authorization: token,
      },
    }
  );
};

const editUser = (formData: FormData, token: string) => {
  return fetch(`${SERVER_URL}/cheer/edit-user`, {
    method: "PUT",
    headers: {
      Authorization: token,
    },
    body: formData,
  });
};

export const fetcher = {
  get: {
    getPosts,
    getUsers,
    getUser,
    getUserPosts,
    getPost,
    getComments,
    isUserNameExists,
    followers,
    following,
  },
  post: {
    createPost,
    logIn,
    setUserName,
    createComment,
  },
  delete: { deletePost, deleteComment },
  put: { toggleFollow, toggleLike, editUser },
};
