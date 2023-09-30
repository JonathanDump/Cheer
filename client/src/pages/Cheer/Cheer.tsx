import { Outlet } from "react-router-dom";
import cl from "./Cheer.module.scss";
import AuthProvider from "../../components/AuthProvider/AuthProvider";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function Cheer() {
  return (
    <AuthProvider>
      <div className={cl.cheer}>
        <div>Cheer</div>
        <Sidebar />
        <Outlet />
      </div>
    </AuthProvider>
  );
}
