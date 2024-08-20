import { ClerkProvider } from "@clerk/clerk-react";
import { Link, Outlet } from "react-router-dom";
import {
  SignedIn,
  UserButton,
} from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between bg-secondary-content px-4 py-2">
          <Link to="/home">
            <span className="text-2xl font-bold tracking-wide">Aora</span>
          </Link>
          <div>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <main className="flex-1 h-full overflow-hidden">
          <Outlet />
        </main>
      </div>
    </ClerkProvider>
  );
};

export default RootLayout;
