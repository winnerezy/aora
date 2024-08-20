import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Chat } from "./pages/Chat.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { Home } from "./pages/Home.tsx";
import RootLayout from "./layouts/RootLayout.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import { SignInPage } from "./pages/SignInPage.tsx";
import { SignUpPage } from "./pages/SignUpPage.tsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/dashboard/chat/:id",
            element: <Chat />,
          },
        ],
      },
      {
        path: "/sign-in/*",
        element: <SignInPage/>
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage/>
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
  
      <RouterProvider router={router} />
   
  </StrictMode>
);
