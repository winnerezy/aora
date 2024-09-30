
import { File as FileProp } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { BiCalendar, BiGhost, BiMessage, BiTrash } from "react-icons/bi";
import { deleteUserFile, getUserFiles } from "@/lib/utils/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";

const File = (file: FileProp) => {

    const [currentlyDeletingFile, setCurrentlyDeletedFile] = useState<string | null>(null)
    const queryClient = useQueryClient();
  
  
    const { mutate: deleteFile } = useMutation({
      mutationFn: deleteUserFile,
      onMutate(id) {
        setCurrentlyDeletedFile(id)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["files"], type: 'active' });
      },
  
      onSettled() {
        setCurrentlyDeletedFile(null)
      },
    });
  return (
    <div
      key={file.id}
      className="w-full h-[120px] rounded-lg bg-card/10 shadow-sm hover:shadow-md divide-y divide-gray-400 col-span-1 border"
    >
      <Link href={`/chat/${file.id}`}>
        <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-2">
              <h3 className="truncate text-lg font-medium">{file.name}</h3>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-4 mt-4 pt-2 grid grid-cols-3 place-items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <BiCalendar className="size-6" />
          <span>{format(file.createdAt, "MMM yyyy")}</span>
        </div>
        <div className="flex items-center gap-2">
          <BiMessage className="size-5" />
        </div>
        <Button
          className="text-white rounded-lg w-full flex items-center justify-center"
          variant="destructive"
          onClick={() => deleteFile(file.id)}
        >
          {
          currentlyDeletingFile === file.id ?
            <span className="loader" />
            :
            <BiTrash className="size-6 " />
        }
        </Button>
      </div>
    </div>
  );
};

export default File;
