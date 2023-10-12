import { Outlet } from "react-router-dom";
import cl from "./Cheer.module.scss";
import AuthProvider from "../../components/AuthProvider/AuthProvider";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

export default function Cheer() {
  return (
    <AuthProvider>
      <div className={cl.cheer}>
        <Header />
        <Sidebar />
        <Outlet />
      </div>
    </AuthProvider>
  );
}
