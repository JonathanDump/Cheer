import { IUser } from "../../interfaces/interfaces";

export default function getItemFromLocalStorage(itemName: string) {
  const item = localStorage.getItem(itemName) as string;
  if (itemName === "user") {
    return JSON.parse(item) as IUser;
  }
  return item;
}
