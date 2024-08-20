'use client'

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFile } from "react-icons/fa6";
import {PdfReader} from "pdfreader"

export const CreateChatModal = () => {

    const [pdf, setPdf] = useState<string>("")
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
        const reader = new FileReader()
  
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const textDecoder = new TextDecoder('utf-8');
            const binaryStr = textDecoder.decode(arrayBuffer);
          console.log(binaryStr)
          setPdf(binaryStr)
        }
        reader.readAsArrayBuffer(file)
      })
  }, []);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box h-[400px] flex flex-col items-center justify-center gap-4">
        <h3 className="text-xl font-bold">Select a PDF</h3>
        <div {...getRootProps()}>
          <input {...getInputProps()} accept=".pdf"/>
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <FaFile className="size-16"/>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
  // useEffect(()=> {
  //   new PdfReader().parseFileItems(pdf, (err, item) => {
  //       if(err) console.log(err)
  //       else if(!item) console.log("End of file")
  //       else if(item.text) console.log(item.text)
  //   })
  // }, [])
