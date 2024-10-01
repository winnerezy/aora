"use client";

import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" className="light">
        <body className={`${roboto.className} antialiased`}>
          <script
            src="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"
            type="module"
          />
          <div>{children}</div>
          <Toaster />
        </body>
      </html>
    </QueryClientProvider>
  );
}
