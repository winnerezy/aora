import Chat from "@/components/chat/Chat";
import PdfRenderer from "@/components/PdfRenderer";
import { getCurrentUser } from "@/lib/utils/actions";
import { prisma } from "@/lib/utils/prisma";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    fileId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { fileId } = params;

  const user = await getCurrentUser();

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
    <section className="flex-1 flex justify-between flex-col h-full">
      <div className="flex flex-col lg:flex-row xl:px-2">
        <div className="px-4 flex-1 w-full">
          <PdfRenderer url={file.url} />
        </div>

        <div className="relative h-[calc(100dvh-56px)] flex-[0.75] lg:w-96 lg:border-l px-2">
          <Chat fileId={file.id} fileUrl={file.url} />
        </div>
      </div>
    </section>
  );
}