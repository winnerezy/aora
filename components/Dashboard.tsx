"use client";

import { deleteUserFile, getUserFiles } from "@/lib/utils/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { BiCalendar, BiGhost, BiMessage, BiTrash } from "react-icons/bi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { format } from "date-fns";
import { useState } from "react";

const Dashboard = () => {
    const [currentlyDeletingFile, setCurrentlyDeletedFile] = useState<string | null>(null)
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["files"],
    queryFn: () => getUserFiles(),
  });

  const { mutate: deleteFile } = useMutation({
    mutationFn: deleteUserFile,
    onSuccess: () => {
      console.log("File deleted successfully");
     queryClient.invalidateQueries({ queryKey: ["files"], type: 'active' });
    },
    onMutate(id) {
        setCurrentlyDeletedFile(id)
    },
    onSettled(data) {
        setCurrentlyDeletedFile(null)
    },
  });

  return (
    <>
      {files && files?.length !== 0 ? (
        <ul className="mt-8 gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 transition">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="w-full h-[120px] rounded-md border bg-neutral shadow hover:shadow-lg divide-y divide-gray-600 col-span-1"
              >
                <Link href={`dashboard/chat/${file.id}`}>
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="size-10 flex-shrink-0 rounded-full bg-zinc-400" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-2">
                        <h3 className="truncate text-lg font-medium text-zinc-300">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-6 mt-4 pt-2 grid grid-cols-3 place-items-center gap-6 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <BiCalendar className="size-6" />
                    <span>{format(file.createdAt, "MMM yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BiMessage />
                    <span>0</span>
                  </div>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="bg-red-500  rounded-lg w-full flex items-center justify-center"
                  >
                 {
                    currentlyDeletingFile === file.id ?
                    <span className="loading loading-spinner loading-x"/>
                    : 
                    <BiTrash className="size-6 " />
                 }
                  </button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <SkeletonTheme baseColor="#3f3f46">
          <Skeleton className="my-2" height={100} count={3} />
        </SkeletonTheme>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <BiGhost className="size-10 text-zinc-300" />
          <h3 className="font-semibold text-xl">Nothing to see here</h3>
          <span className="text-sm text-zinc-300">
            Let&apos;s upload your first PDF
          </span>
        </div>
      )}
    </>
  );
};

export default Dashboard;
