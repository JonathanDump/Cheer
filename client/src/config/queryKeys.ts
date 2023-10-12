export const postKeys = {
  all: ["posts"],
  home: (token: string) => [...postKeys.all, { token }],
  user: (filters: { userId: string; token: string }) => ["posts", filters],
  single: (filters: { postId: string; token: string }) => ["post", filters],
};

export const userKeys = {
  user: ["user"],
  allUsers: ["all users"],
  allUsersToken: (token: string) => [...userKeys.allUsers, token],
  followers: ["followers"],
  followersFilter: (token: string, userName: string) => [
    ...userKeys.followers,
    token,
    userName,
  ],
  following: ["following"],
  followingFilter: (token: string, userName: string) => [
    ...userKeys.following,
    token,
    userName,
  ],
};

export const commentKeys = {
  all: ["comments"],
};
