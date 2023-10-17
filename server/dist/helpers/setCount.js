"use strict";
// import { IPost } from "../interfaces/interfaces";
// import Post from "../models/post";
Object.defineProperty(exports, "__esModule", { value: true });
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
function setCount(object, keys) {
    keys.forEach((key) => {
        object[key] = object[key].length;
    });
    return object;
}
exports.default = setCount;
