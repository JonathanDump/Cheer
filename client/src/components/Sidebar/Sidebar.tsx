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
      <div className={cl.mainNavigation}>
        <NavLink to={"/home"} className={cl.navigation}>
          Home
        </NavLink>
        <NavLink to={"/users"} className={cl.navigation}>
          Users
        </NavLink>
        <NavLink to={`/${user.userName}`} className={cl.navigation}>
          Profile
        </NavLink>
      </div>
      <div className={cl.secondaryNavigation}>
        <button type="button" onClick={handleLogOutClick}>
          Log Out
        </button>
      </div>
    </div>
  );
}
