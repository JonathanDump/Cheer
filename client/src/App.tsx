import { Outlet } from "react-router-dom";
import cl from "./App.module.scss";
import UserNameForm from "./components/UserNameForm/UserNameForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={cl.app}>
        <div>App</div>
        <Outlet />
        {/* <UserNameForm /> */}
      </div>
    </QueryClientProvider>
  );
}

export default App;
