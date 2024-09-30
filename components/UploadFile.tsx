"use client";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { BiCloud } from "react-icons/bi";
import { buttonVariants } from "./ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "./ui/progress";
import { useMutation } from "@tanstack/react-query";
import { getFile } from "@/lib/utils/actions";

const UploadFile = () => {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [acceptedFiles, setAcceptedFiles] = useState<File[] | null>(null);
  const { startUpload } = useUploadThing("pdfUploader");
  const { toast } = useToast();

  const { mutate: startPolling, error } = useMutation({
    mutationFn: getFile,
    onSuccess: (file) => {
      router.push(`/chat/${file?.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  // handle file uploading progress
  const startProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);
    return interval;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      const progressInterval = startProgress();
      setAcceptedFiles(acceptedFiles);

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          const binaryStr = reader.result;
        };
        reader.readAsDataURL(file);
      });

      if (acceptedFiles[0].size > 16000000) {
        toast({
          title: "File Too Large",
        });
        clearInterval(startProgress());
        return;
      }
      const res = await startUpload(acceptedFiles);
      if (!res) {
        toast({
          title: "Upload failed please try again",

          duration: 3000,
        });
      }
      const [fileResponse] = res!;

      const key = fileResponse?.key;

      if (!key) {
        toast({
          title: "Upload failed please try again",

          duration: 3000,
        });
      }

      setUploadProgress(100);
      clearInterval(progressInterval);
      setIsUploading(false);
      startPolling(key);
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ className: "bg w-24" })}>
        Upload
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-background h-[300px] rounded-lg flex flex-col items-center justify-center">
        <DialogTitle>
          {isUploading
            ? "Uploading"
            : uploadProgress === 95
            ? "Almost Done"
            : uploadProgress === 100
            ? "Completed"
            : "Upload"}{" "}
          PDF
        </DialogTitle>
        {acceptedFiles ? (
          <Progress value={uploadProgress} />
        ) : (
          <>
            <div
              {...getRootProps()}
              className="w-full h-[90%] border border-dashed self-center flex flex-col items-center justify-center"
            >
              <BiCloud size={40} />
              <p>Click To Upload</p>
              <span className="text-xs">or</span>
              <p>Drag n Drop</p>
            </div>
            <input
              {...getInputProps()}
              type="file"
              accept=".pdf"
              multiple={false}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadFile;
