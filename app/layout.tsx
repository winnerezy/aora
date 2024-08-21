import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import "react-loading-skeleton/dist/skeleton.css"

import Link from "next/link";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Aora",
  description: "PDF Chat Bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" >
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between bg-[#1a1a24] px-4 py-2">
          <Link href="/home">
            <span className="text-2xl font-bold tracking-wide">Aora</span>
          </Link>
          <div>
            <SignedIn>
              <UserButton/>
            </SignedIn>
          </div>
        </header>
        <main className="flex h-full overflow-hidden bg-neutral">
          {children}
        </main>
      </div>
    </ClerkProvider>
      </body>
    </html>
  );
}
