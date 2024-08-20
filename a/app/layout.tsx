import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";

import Link from "next/link";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const SECRET_KEY = process.env.CLERK_SECRET_KEY!;

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between bg-neutral px-4 py-2">
          <Link href="/home">
            <span className="text-2xl font-bold tracking-wide">Aora</span>
          </Link>
          <div>
            <SignedIn>
              <UserButton/>
            </SignedIn>
          </div>
        </header>
        <main className="flex h-full overflow-hidden">
          {children}
        </main>
      </div>
    </ClerkProvider>
      </body>
    </html>
  );
}
