import { auth } from "@/auth";
import FileGrid from "@/components/FileGrid";
import { Button } from "@/components/ui/button";
import UploadFile from "@/components/UploadFile";
import { prisma } from "@/lib/utils/prisma";
import { redirect } from "next/navigation";
import { FaGhost } from "react-icons/fa6";

const page = async () => {

  return (
    <div className="flex flex-col gap-4 min-h-full w-full max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mt-8">
        <h3 className="text-xl font-bold">My PDF's</h3>
        <UploadFile/>
      </div>
      <FileGrid/>
    </div>
  );
};

export default page;
