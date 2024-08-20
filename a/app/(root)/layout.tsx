import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aora",
  description: "PDF Chat Bot",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex w-full h-full px-4">{children}</div>;
}
