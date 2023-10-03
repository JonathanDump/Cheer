import { io } from "socket.io-client";
import { ICreatePostFormValues } from "../interfaces/interfaces";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const SERVER_URL = import.meta.env.VITE_API_ENDPOINT;
export const socket = io(SERVER_URL, { autoConnect: false });

export const postInitialValue: ICreatePostFormValues = {
  text: "",
  images: [],
};
