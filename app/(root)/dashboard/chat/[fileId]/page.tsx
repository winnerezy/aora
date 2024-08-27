import { auth } from "@/auth";
import Chat from "@/components/chat/Chat";
import PdfRenderer from "@/components/PdfRenderer";
import { getCurrentUser } from "@/lib/utils/actions";
import { prisma } from "@/lib/utils/prisma";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    fileId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { fileId } = params;

  const user = await getCurrentUser()

  if (!user) redirect("/");

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
    <section className="flex-1 flex justify-between flex-col h-[calc(100%-3.5rem)] max-lg:overflow-y-scroll">
    <section className="flex-1 flex justify-between flex-col h-[calc(100%-3.5rem)] max-lg:overflow-y-scroll">
      <div className="w-full lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="pl-2 pr-4 pt-2 sm:px-4 lg:pr-12 xl:flex-1 w-full">
            <PdfRenderer url={file.url} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.60] border-t border-gray-400 lg:w-96 lg:border-l lg:border-t-0 h-full">
          <Chat fileId={file.id} fileUrl={file.url}/>
        </div>

      </div>
    </section>
  );
}
