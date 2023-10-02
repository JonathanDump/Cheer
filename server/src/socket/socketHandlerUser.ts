import { Server } from "socket.io";
import { IActiveUser, IDecodedJwt } from "../interfaces/interfaces";
import { disconnect } from "process";

export let activeUsers: IActiveUser[] = [];
export default function socketHandlerUser(io: Server) {
  io.on("connect", (socket) => {
    console.log("connected to the server");
    socket.on("user id", (userId: string) => {
      console.log("socket on userId", userId);

      const userIds = { socketId: socket.id, userId };
      activeUsers.find((user) => user.userId === userIds.userId) ||
        activeUsers.push(userIds);
    });

    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("active users after disconnect", activeUsers);
    });
  });
}
