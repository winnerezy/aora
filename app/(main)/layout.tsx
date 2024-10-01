import "@/app/globals.css";
import Topbar from "@/components/Topbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aura",
  description: "Chat PDF",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen">
      <Topbar />
      <div>{children}</div>
    </main>
  );
}
