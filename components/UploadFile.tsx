"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { getFile } from "@/lib/utils/actions";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Dropzone from "react-dropzone";
import { BiCloud } from "react-icons/bi";
import { FaFile } from "react-icons/fa6";
import Toastify from "toastify-js"

// import {PdfReader} from "pdfreader"

const UploadDropzone = () => {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

  if(error){
    console.log(error)
  }

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        const progressInterval = startProgress();
        const res = await startUpload(acceptedFile);

        if (!res) {
          return Toastify({
            text: "Upload failed please try again",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "left", 
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
        }

        const [fileResponse] = res!;

        const key = fileResponse?.key;

        if (!key) {
          return Toastify({
            text: "Upload failed please try again",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "left", 
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
        }

        setIsUploading(true);
        clearInterval(progressInterval);
        setUploadProgress(100);
        startPolling(key)
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="m-4 border w-[93%] h-64 border-dashed border-gray-500 rounded-lg"
        >
          <div className="w-full h-full flex items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer bg-zinc-600 hover:bg-zinc-700"
            >
              <div className="flex flex-col items-center justify-center pt-4 pb-4 text-center">
                <BiCloud className="mb-2" />
                <p className="text-sm text-zinc-300 ">
                  <span>Click to upload</span>
                  {""}
                  <span>or drag n drop</span>
                  <span>Upload up to 16MB</span>
                </p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-zinc-500 flex rounded-md overflow-hidden outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-4 py-2 h-full grid place-content-center">
                    <FaFile className="h-6" />
                  </div>
                  <p className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </p>
                </div>
              ) : null}
              {isUploading ? (
                <div className="w-full mt-4 mx-auto max-w-xs">
                  <progress
                    className="progress"
                    value={uploadProgress}
                    max={100}
                  >
                    {" "}
                  </progress>
                </div>
              ) : null}
              <input type="file" id="dropzone-file" {...getInputProps} hidden/>
            </label>
          </div>
        </div>
      )}
    </Dropzone>
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
      <div className="modal-box h-[400px] flex flex-col items-center justify-center gap-4">
        <h3 className="text-xl font-bold">Select a PDF</h3>
        <UploadDropzone />
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
