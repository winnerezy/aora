"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { getFile } from "@/lib/utils/actions";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";
import { BiCloud } from "react-icons/bi";
import { FaFile } from "react-icons/fa6";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import cn from "classnames";

const UploadDropzone = () => {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [acceptedFile, setAcceptedFile] = useState<File[] | null>(null)
  const { startUpload } = useUploadThing("pdfUploader");

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

  const { mutate: startPolling, error } = useMutation({
    mutationFn: getFile,
    onSuccess: (file) => {
      router.push(`/dashboard/chat/${file?.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  if (error) {
    console.log(error.message);
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
   
    startProgress()
    setAcceptedFile(acceptedFile)
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
      };
      reader.readAsDataURL(file);
    });
    const res = await startUpload(acceptedFiles)

    if (!res) {
      return Toastify({
        text: "Upload failed please try again",

        duration: 3000,
      }).showToast();
    }

    const [fileResponse] = res!;

    const key = fileResponse?.key;

    if (!key) {
      return Toastify({
        text: "Upload failed please try again",

        duration: 3000,
      }).showToast();
    }

    setIsUploading(true);
    setUploadProgress(100);
    startPolling(key);
    
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });




















  return (

    <div
    {...getRootProps()}
    className="m-4 w-[93%] h-64 border-dashed border rounded-lg"

  >
    <div className="w-full h-full flex items-center justify-center">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center pt-4 pb-4 text-center">
          <BiCloud className="mb-2 size-10" />
          <p className="text-sm flex flex-col">
            <span>Click to upload</span>
            <span>or</span>
            <span>drag n drop</span>
          </p>
          <span>Upload up to 64MB</span>
        </div>
        {acceptedFile && acceptedFile[0] ? (
          <div className="max-w-xs bg-zinc-300 dark:bg-zinc-600 flex rounded-md overflow-hidden outline-zinc-200 divide-x divide-zinc-200">
            <div className="px-4 py-2 h-full grid place-content-center">
              <FaFile className="h-6" />
            </div>
            <p className="px-3 py-2 h-full text-sm truncate">
              {acceptedFile[0].name}
            </p>
          </div>
        ) : null}
        {isUploading ? (
          <div className="w-full mt-4 mx-auto max-w-xs px-4">
            <progress
              className={cn(
                "progress max-w-xs",
                uploadProgress === 100
                  ? "text-green-400"
                  : "text-foreground"
              )}
              value={uploadProgress}
              max={100}
            >
              {" "}
            </progress>
           
          </div>
        ) : null}
      </label>
    </div>
     <input
              type="file"
              id="dropzone-file"
              {...getInputProps()}
              accept=".pdf"
              multiple={false}
            />
  </div>

  );
};

export const UploadFile = () => {
  const [pdf, setPdf] = useState<string>("");
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result as string;
        console.log(binaryStr);
        setPdf(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box h-[400px] bg-background flex flex-col items-center justify-center gap-4">
        <h3 className="text-xl font-bold">Select a PDF</h3>
        <UploadDropzone />
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
