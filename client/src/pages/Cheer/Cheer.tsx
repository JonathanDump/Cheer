import { Outlet } from "react-router-dom";
import cl from "./Cheer.module.scss";

export default function Cheer() {
  return (
    <div className={cl.cheer}>
      <div>Cheer</div>
      <Outlet />
    </div>
  );
}
