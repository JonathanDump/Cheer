import { Outlet } from "react-router-dom";
import cl from "./App.module.scss";
import UserNameForm from "./components/UserNameForm/UserNameForm";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "./config/config";

export default function App() {
  const [isUserNameFormVisible, setIsUserNameFormVisible] = useState(false);

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
