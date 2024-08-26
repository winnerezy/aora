"use server";

import { auth, signIn } from "@/auth";
import { UploadedFileData } from "uploadthing/types";
import { prisma } from "./prisma";

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
      email: session.user?.email!
    },
  });
  if (!user) return;
  return user;
};

export const getUserFiles = async () => {
    
  const user = await getCurrentUser()

  if (!user) return;

  const files = await prisma.file.findMany({
    where: {
      userid: user.id,
    },
    include: {
      message: true
    }
  });

  return files;
};

export const deleteUserFile = async (fileId: string) => {
  const user = await getCurrentUser()

  if (!user) return;


  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userid: user.id,
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
  const user = await getCurrentUser()

  if (!user) return;


  const file = await prisma.file.findFirst({
    where: {
      key,
      userid: user.id,
    },
  });

  if (!file) {
    return;
  }
  return file;
};

export const getFileUploadStatus = async(fileId: string) => {
  const user = await getCurrentUser()

  if (!user) return;


  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
      userid: user.id
    }
   })

   if(!file) return {status: "PENDING" as const}

   return {status: file.uploadStatus}
}

export const getFileMessages = async (fileId: string, pageParam: string | undefined) => {
  const limit = 10
  const messages = await prisma.message.findMany({
    take: limit,
    where: {
      fileId
    },
    cursor: pageParam ? { id: pageParam } : undefined,
    skip: fileId === "" ? 1 : 0,
    orderBy: {
      createdAt: "desc"
    }
  })


  const nextCursor = messages.length === limit ? messages[limit - 1].id : undefined
  return {
    messages,
    nextCursor
  }
}