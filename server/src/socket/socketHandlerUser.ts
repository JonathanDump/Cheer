import { Server } from "socket.io";
import { IActiveUser } from "../interfaces/intefaces";

export let activeUsers: IActiveUser[] = [];
export default function socketHandlerUser(io: Server) {
  io.on("connect", (socket) => {});
}
