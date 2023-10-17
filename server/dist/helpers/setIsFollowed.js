"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setIsFollowed(user, id) {
    const isFollowed = user.followers.some((followerId) => followerId.toString() === id);
    user.isFollowed = isFollowed;
    return user;
}
exports.default = setIsFollowed;
