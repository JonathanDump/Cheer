import { activeUsers } from "../socket/socketHandlerUser";

export default function findActiveUser(userId: string) {
  return activeUsers.filter((user) => user.userId === userId)[0];
}
