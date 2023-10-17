"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketHandlerUser_1 = require("../socket/socketHandlerUser");
function findActiveUser(userId) {
    return socketHandlerUser_1.activeUsers.filter((user) => user.userId === userId)[0];
}
exports.default = findActiveUser;
