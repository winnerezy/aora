import { auth } from "@/auth";
import { createUpload, getCurrentUser } from "@/lib/utils/actions";
import { prisma } from "@/lib/utils/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
    .middleware(async () => {
      const user = await getCurrentUser()
    
      return { userId: user?.id! };
    })
    .onUploadComplete(async ({ metadata, file }) => {

      const isFileExist = await prisma.file.findFirst({
        where: {
          key: file.key,
        },
      })

      if (isFileExist) return
      await createUpload(file, metadata)

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
