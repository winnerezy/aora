'use client'

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>

    <div className="flex w-full h-full px-4">{children}</div>;
    </QueryClientProvider>
  )
}
