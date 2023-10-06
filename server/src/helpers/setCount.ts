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
  console.log("object", object);
  console.log("keys", keys);

  console.log(keys[0], object[keys[0]].length);

  keys.forEach((key) => {
    console.log("key", key);
    console.log(key, object[key].length);
    object[key] = object[key].length;
  });
  console.log("updated obj", object);

  return object;
}
