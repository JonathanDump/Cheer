import { Outlet, useNavigate } from "react-router-dom";
import cl from "./App.module.scss";
import UserNameForm from "./components/UserNameForm/UserNameForm";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryClient } from "./config/config";
import getItemFromLocalStorage from "./helpers/functions/getItemFromLocalStorage";

export default function App() {
  const [isUserNameFormVisible, setIsUserNameFormVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = getItemFromLocalStorage<string>("token");
    if (token) {
      navigate("/home");
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <div className={cl.app}>
        <Outlet context={{ setIsUserNameFormVisible }} />
        {isUserNameFormVisible && (
          <UserNameForm setIsUserNameFormVisible={setIsUserNameFormVisible} />
        )}
      </div>
    </QueryClientProvider>
  );
}
