"use server";

import { Provider } from "next-auth/providers"
import { User } from "@/types"
import { prisma } from "./prisma";
import { auth, signIn } from "@/auth";
import { UploadedFileData } from "uploadthing/types";

export const signin = async (provider: string) => {
  await signIn(provider)
}

interface FIleProps extends UploadedFileData {
  key: string
}

interface MetadataProps {
  userId: string
}

export const createUpload = async (file: FIleProps, metadata: MetadataProps) => {
  const createdFile = await prisma.file.create({
    data: {
      key: file.key,
      name: file.name,
      userid: metadata.userId,
      url: file.url,
      uploadStatus: "SUCCESS"
    }
  })
  return createdFile
}

export const getCurrentUser = async () => {
    const session = await auth()

  if (!session) return;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user?.id
    },
  });
  if (!user) return;
  return user;
};

export const getUserFiles = async () => {
    const session = await auth()

  if (!session) return;

  const files = await prisma.file.findMany({
    where: {
      userid: session.user?.id,
    },
  });

  return files;
};

export const deleteUserFile = async (fileId: string) => {
    const session = await auth()

    if (!session) return;

  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userid: session.user?.id,
    },
  });

  if (!file) {
    return;
  }

  await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
};

export const getFile = async (key: string) => {
    const session = await auth()

    if (!session) return;

  const file = await prisma.file.findFirst({
    where: {
      key,
      userid: session.user?.id,
    },
  });

  if (!file) {
    return;
  }
  return file;
};

export const getFileUploadStatus = async(fileId: string) => {
  const session = await auth()

  if (!session) return;

  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
      userid: session.user?.id
    }
   })

   if(!file) return {status: "PENDING" as const}

   return {status: file.uploadStatus}
}