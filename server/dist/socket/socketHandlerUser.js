"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeUsers = void 0;
exports.activeUsers = [];
function socketHandlerUser(io) {
    io.on("connect", (socket) => {
        console.log("connected to the server");
        socket.on("user id", (userId) => {
            const userIds = { socketId: socket.id, userId };
            exports.activeUsers.find((user) => user.userId === userIds.userId) ||
                exports.activeUsers.push(userIds);
        });
        socket.on("disconnect", () => {
            exports.activeUsers = exports.activeUsers.filter((user) => user.socketId !== socket.id);
        });
    });
}
exports.default = socketHandlerUser;
