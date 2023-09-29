import { Server } from "socket.io";
import { IActiveUser, IDecodedJwt } from "../interfaces/intefaces";

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
  });
}
