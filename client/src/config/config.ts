import { io } from "socket.io-client";

export const SERVER_URL = import.meta.env.VITE_API_ENDPOINT;
export const socket = io(SERVER_URL, { autoConnect: false });
