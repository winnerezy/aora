import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";

export const App = () => {
  return (
    <section className="w-full h-screen flex">
      <Sidebar />
      <div className="flex px-2 w-full">
        <Outlet />
      </div>
    </section>
  );
};
