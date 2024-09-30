"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { File as FileProps } from "@prisma/client";
import { FaGhost } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { BiXCircle } from "react-icons/bi";
import File from "./File";

const FileGrid = () => {
  const {
    data: files,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const res = await axios.get("/api/files");
      return res.data as FileProps[];
    },
  });
  return (
    <>
      {files && files.length !== 0 ? (
        <section className="w-full gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 transition place-items-center">
          {files.map((file) => (
            <File {...file} key={file.id} />
          ))}
        </section>
      ) : isLoading ? (
        <div className="mt-8 gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 transition">
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
        </div>
      ) : error ? (
        <div className="flex flex-col mt-8 gap-4 items-center">
          <BiXCircle size={60} className="text-destructive" />
          <p className="font-light">Error. Try Again</p>
        </div>
      ) : (
        <div className="flex flex-col mt-8 gap-4 items-center">
          <FaGhost size={60} className="text-card" />
          <p className="font-light">This place seeme empty</p>
        </div>
      )}
    </>
  );
};

export default FileGrid;
