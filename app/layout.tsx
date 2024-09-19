import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import Header from "@/components/Header";
import cn from "classnames";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
      <body className={cn(montserrat.className, "h-[100dvh] sm:min-h-[100dvh] overflow-y-hidden")}>
        <script
          src="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"
          type="module"
        />
        <Header />

        <main className="flex h-full overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
