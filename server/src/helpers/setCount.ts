// import { IPost } from "../interfaces/interfaces";
// import Post from "../models/post";

// export default async function setCount(post: IPost) {
//   const likes = await Post.aggregate([
//     { $match: { _id: post._id } },
//     { $project: { likes: { $size: "$likes" } } },
//   ]);
//   const comments = await Post.aggregate([
//     { $match: { _id: post._id } },
//     { $project: { comments: { $size: "$comments" } } },
//   ]);

//   return {
//     ...post,
//     likes: likes[0].likes || 0,
//     comments: comments[0].comments || 0,
//   };
// }

export default function setCount(object: any, keys: string[]) {
  keys.forEach((key) => {
    object[key] = object[key].length;
  });

  return object;
}
