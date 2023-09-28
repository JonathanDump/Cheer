import { useOutletContext } from "react-router-dom";
import { IOutletContext } from "../interfaces/interfaces";

export default function useSetIsUserNameFormVisible() {
  return useOutletContext<IOutletContext>();
}
