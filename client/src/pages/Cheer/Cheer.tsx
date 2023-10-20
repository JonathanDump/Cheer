import { Outlet, useLocation, useNavigate } from "react-router-dom";
import cl from "./Cheer.module.scss";
import AuthProvider from "../../components/AuthProvider/AuthProvider";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";

export default function Cheer() {
  const [isWindowNarrow, setIsWindowNarrow] = useState(false);
  const screenWidth = window.matchMedia("(max-width: 650px)");
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const cheerClass = isWindowNarrow
    ? `${cl.cheer} ${cl.narrow}`
    : `${cl.cheer}`;

  useEffect(() => {
    screenWidth.matches && setIsWindowNarrow(true);
    screenWidth.onchange = (e) => {
      if (e.matches) {
        setIsWindowNarrow(true);
      } else {
        setIsWindowNarrow(false);
      }
    };
  }, [screenWidth]);

  useEffect(() => {
    if (path === "/" && !getItemFromLocalStorage<string>("token")) {
      navigate("/log-in");
    } else if (path === "/") {
      navigate("/home");
    }
  }, [navigate, path]);

  return (
    <AuthProvider>
      <div className={cheerClass}>
        {!isWindowNarrow && <Sidebar />}
        <Outlet />
        {isWindowNarrow && <Navbar />}
      </div>
    </AuthProvider>
  );
}
