import { getCurrentUser } from "@/lib/utils/actions";
import { prisma } from "@/lib/utils/prisma";
import { auth, currentUser, getAuth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const middleware = async () => {
  try {
    const {userId} = auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    return { userId: userId };
  } catch (error) {
    console.error("Middleware error:", error);
    throw error;
  }
};

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(() => middleware())
    .onUploadComplete(async ({ metadata, file }) => {

      const createFile = await prisma.file.create({
        data: {
          key: file.key,
          name: file.name,
          userid: metadata.userId,
          url: `https://uploadthing.prod.s3.us.wets.2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING"
        }
      })
      
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
