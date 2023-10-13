import { NavLink, useNavigate } from "react-router-dom";
import cl from "./Sidebar.module.scss";
import { IUser } from "../../interfaces/interfaces";

export default function Sidebar() {
  const user: IUser = JSON.parse(localStorage.getItem("user") as string);
  const navigate = useNavigate();

  const handleLogOutClick = () => {
    localStorage.clear();
    navigate("/log-in");
  };

  return (
    <div className={cl.sidebar}>
      <div className={cl.container}>
        <div className={cl.logo}>Cheer</div>
        <div className={cl.mainNavigation}>
          <NavLink
            to={"/home"}
            className={({ isActive }) => (isActive ? `${cl.navActive}` : "")}
          >
            Home
          </NavLink>
          <NavLink
            to={"/users"}
            className={({ isActive }) => (isActive ? `${cl.navActive}` : "")}
          >
            Users
          </NavLink>
          <NavLink
            to={`/${user.userName}`}
            className={({ isActive }) => (isActive ? `${cl.navActive}` : "")}
          >
            Profile
          </NavLink>
        </div>
        <div className={cl.secondaryNavigation}>
          <button type="button" onClick={handleLogOutClick}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
