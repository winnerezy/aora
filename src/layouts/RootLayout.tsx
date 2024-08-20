import React from "react";
import { Link, Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="pl-12">
      <header className="flex items-center justify-between">
        <Link to="/home">
          <span>Aora</span>
        </Link>
      </header>
      <main className="flex-1 overflow-hidden bg-white">
        <Outlet/>
      </main>
    </div>
  );
};

export default RootLayout;
