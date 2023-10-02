import { Outlet, useParams } from "react-router-dom";
import cl from "./UserProfile.module.scss";

export default function UserProfile() {
  const { userId, postId } = useParams();
  console.log("userId", userId);
  console.log("postId", postId);
  console.log(useParams());
  return (
    <div>
      UserProfile
      <Outlet />
    </div>
  );
}
