import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";

import Link from "next/link";
import UserAccount from "@/components/UserAccount";
import { getCurrentUser } from "@/lib/utils/actions";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Aora",
  description: "PDF Chat Bot",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const user = await  getCurrentUser()
  return (
    <html lang="en" className="dark">
      <body className={poppins.className}>
        <script src="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js" type="module"/>
        <div className="relative flex flex-col min-h-screen md:h-screen">
          <header className="flex items-center justify-between px-4 py-2 border-b">
            <Link href="/dashboard">
              <span className="text-2xl font-bold tracking-wide">Aora</span>
            </Link>
         {
          user &&  <UserAccount user={user}/>
         }
          </header>
          <main className="flex h-full overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
