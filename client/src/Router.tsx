import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home/Home";
import LogIn from "./pages/LogIn/LogIn";
import SignUp from "./pages/SignUp/SignUp";
import Users from "./pages/Users/Users";
import UserProfile from "./pages/UserProfile/UserProfile";
import PostPage from "./pages/PostPage/PostPage";
import FollowersList from "./pages/FollowersList/FollowersList";
import Cheer from "./pages/Cheer/Cheer";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/log-in", element: <LogIn /> },
        { path: "/sign-up", element: <SignUp /> },
        {
          path: "/",
          element: <Cheer />,
          children: [
            { path: "/home", element: <Home /> },
            { path: "/users", element: <Users /> },
            {
              path: "/:userId",
              element: <UserProfile />,
              children: [
                { path: "/:userId/:postId", element: <PostPage /> },
                { path: "/:userId/:following", element: <FollowersList /> },
                { path: "/:userId/:followers", element: <FollowersList /> },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
