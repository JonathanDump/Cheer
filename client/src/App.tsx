import { Outlet } from "react-router-dom";
import cl from "./App.module.scss";
import UserNameForm from "./components/UserNameForm/UserNameForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient();

export default function App() {
  const [isUserNameFormVisible, setIsUserNameFormVisible] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={cl.app}>
        <div>App</div>
        <Outlet context={{ setIsUserNameFormVisible }} />
        {isUserNameFormVisible && (
          <UserNameForm setIsUserNameFormVisible={setIsUserNameFormVisible} />
        )}
        {/* <UserNameForm setIsUserNameFormVisible={setIsUserNameFormVisible} /> */}
      </div>
    </QueryClientProvider>
  );
}
