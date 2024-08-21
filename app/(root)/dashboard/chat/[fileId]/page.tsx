import Chat from "@/components/Chat";
import PdfRenderer from "@/components/PdfRenderer";
import { prisma } from "@/lib/utils/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    fileId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { fileId } = params;

  const userData = await currentUser();

  if (!userData) return;

  const user = await prisma.user.findUnique({
    where: {
      email: userData.emailAddresses[0].emailAddress,
    },
  });

  if (!user) redirect("/home");

  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userid: user.id,
    },
  });

  if (!file) {
    return notFound();
  }

  return (
    <section className="flex-1 flex justify-between flex-col h-[calc(100vh - 3.5rem)]">
      <div className="max-w-screen-2xl mx-auto w-full grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:px-8 xl:flex-1 xl:pl-6">
            <PdfRenderer />
          </div>
        </div>
       
        <div className="shrink-0 flex-[0.70] border-t border-gray-400 lg:w-96 lg:border-l lg:border-t-0"></div>
      <Chat/>
      </div>
    </section>
  );
}
