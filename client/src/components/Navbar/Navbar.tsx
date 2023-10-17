import { NavLink, useNavigate } from "react-router-dom";
import cl from "./Navbar.module.scss";
import { IUser } from "../../interfaces/interfaces";
import { ReactComponent as HomeIcon } from "../../icons/home.svg";
import { ReactComponent as PeopleIcon } from "../../icons/people.svg";
import { ReactComponent as ProfileIcon } from "../../icons/profile.svg";
import { ReactComponent as LogOutIcon } from "../../icons/logOut.svg";

export default function Navbar() {
  const user: IUser = JSON.parse(localStorage.getItem("user") as string);
  const navigate = useNavigate();

  const handleLogOutClick = () => {
    localStorage.clear();
    navigate("/log-in");
  };

  return (
    <div className={cl.navbar}>
      <button type="button" onClick={handleLogOutClick}>
        <LogOutIcon />
      </button>
      <NavLink
        to={"/users"}
        className={({ isActive }) => (isActive ? `navActive` : "")}
      >
        <PeopleIcon />
      </NavLink>
      <NavLink
        to={`/${user.userName}`}
        className={({ isActive }) => (isActive ? `navActive` : "")}
      >
        <ProfileIcon />
      </NavLink>
      <NavLink
        to={"/home"}
        className={({ isActive }) => (isActive ? `navActive` : "")}
      >
        <HomeIcon />
      </NavLink>
    </div>
  );
}
