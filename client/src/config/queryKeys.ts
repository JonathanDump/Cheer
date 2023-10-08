export const postKeys = {
  all: ["posts"],
  home: (token: string) => [...postKeys.all, { token }],
  user: (filters: { userId: string; token: string }) => ["posts", filters],
  single: (filters: { postId: string; token: string }) => ["post", filters],
};

export const userKeys = {
  user: ["user"],
};

export const commentKeys = {
  all: ["comments"],
};
