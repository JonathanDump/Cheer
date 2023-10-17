"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getUserPayload(user) {
    return {
        _id: user._id,
        name: user.name,
        image: user.image,
        userName: user.userName,
        isAdmin: user.isAdmin || undefined,
        bio: user.bio,
    };
}
exports.default = getUserPayload;
