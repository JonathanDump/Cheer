"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setIsLiked(obj, id) {
    const isLiked = obj.likes.some((like) => like.toString() === id);
    obj.isLiked = isLiked;
    return obj;
}
exports.default = setIsLiked;
