import { NavLink, useNavigate } from "react-router-dom";
import cl from "./Sidebar.module.scss";
import { IUser } from "../../interfaces/interfaces";
import { ReactComponent as HomeIcon } from "../../icons/home.svg";
import { ReactComponent as PeopleIcon } from "../../icons/people.svg";
import { ReactComponent as ProfileIcon } from "../../icons/profile.svg";
import { ReactComponent as LogOutIcon } from "../../icons/logOut.svg";

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
            className={({ isActive }) => (isActive ? `navActive` : "")}
          >
            <HomeIcon />
            Home
          </NavLink>
          <NavLink
            to={"/users"}
            className={({ isActive }) => (isActive ? `navActive` : "")}
          >
            <PeopleIcon />
            People
          </NavLink>
          <NavLink
            to={`/${user.userName}`}
            className={({ isActive }) => (isActive ? `navActive` : "")}
          >
            <ProfileIcon />
            Profile
          </NavLink>
        </div>
        <div className={cl.secondaryNavigation}>
          <button type="button" onClick={handleLogOutClick}>
            <LogOutIcon />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
