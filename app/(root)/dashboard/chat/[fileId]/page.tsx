import { auth } from "@/auth";
import Chat from "@/components/chat/Chat";
import PdfRenderer from "@/components/PdfRenderer";
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

  const session = await auth()

  if (!session) redirect("/home");

  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userid: session.user?.id,
    },
  });

  if (!file) {
    return notFound();
  }

  return (
    <section className="flex-1 flex justify-between flex-col h-[calc(100vh - 3.5rem)]">
      <div className="w-full grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 pt-6 sm:px-6 lg:px-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={file.url} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-400 lg:w-96 lg:border-l lg:border-t-0 h-screen">
          <Chat fileId={file.id} fileUrl={file.url}/>
        </div>

      </div>
    </section>
  );
}
