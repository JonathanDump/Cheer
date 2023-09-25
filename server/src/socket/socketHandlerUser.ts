import { Server } from "socket.io";
import { IActiveUser, IDecodedJwt } from "../interfaces/intefaces";
import jwtDecode from "jwt-decode";

export let activeUsers: IActiveUser[] = [];
export default function socketHandlerUser(io: Server) {
  io.on("connect", (socket) => {
    if (!socket.handshake.auth.token) {
      socket.emit("invalid token");
    }
    if (socket.handshake.auth.token) {
      const decodedJwt: IDecodedJwt = jwtDecode(
        socket.handshake.auth.token as string
      );

      const userIds = { socketId: socket.id, userId: decodedJwt.user._id! };
      activeUsers.find((user) => user.userId === userIds.userId) ||
        activeUsers.push(userIds);
    }
  });
}
