"use client";

import { createMessage } from "@/lib/utils/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useChat } from "ai/react";
import Link from "next/link";
import {
  ChangeEventHandler,
  MouseEvent,
  MouseEventHandler,
  useRef,
  useState,
} from "react";
import { BiChevronLeft, BiSend, BiXCircle } from "react-icons/bi";
import { pdfjs } from "react-pdf";
import TextArea from "react-textarea-autosize";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Messages from "./Messages";
import { Message } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Input } from "../ui/input";
interface ChatProps {
  fileId: string;
  fileUrl: string;
}

const Chat = ({ fileId, fileUrl }: ChatProps) => {

  const [input, setInput] = useState("");
  const [pdfText, setPdfText] = useState<string>("");
  
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const {
    data,
    isLoading: pdfLoading,
    error: aiError,
  } = useQuery({
    queryKey: ["ai"],
    queryFn: async () => {
      const res = await fetch(fileUrl);
      const resBlob = await res.blob();
      const fileReader = new FileReader();
      fileReader.onload = onLoadFile;
      fileReader.readAsArrayBuffer(resBlob);
      return resBlob;
    },
  });

  function onLoadFile(event: ProgressEvent<FileReader>) {
    const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);
    pdfjs
      .getDocument({
        data: typedArray,
      })
      .promise.then((pdf) => {
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          pdf.getPage(i).then((page) => {
            page.getTextContent().then((content) => {
              content.items.forEach((item) => {
                if ("str" in item) {
                  text += item.str + " ";
                  setPdfText(text);
                }
              });
            });
          });
        }
      });
  }

  const {
    data: messages,
    isLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const res = await fetch(`/api/chat/${fileId}`);
      const ans = await res.json();
      return ans;
    },
  });

  const queryClient = useQueryClient();

  const {
    isPending,
    error,
    mutate: handleSend,
  } = useMutation({
    mutationKey: ["chatmutate"],
    mutationFn: async () => {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ pdfText, message: input, fileId }),
      });
      const ans = await res.json();
      return ans
    },
    async onMutate() {
      const prevChats: Message[] | undefined = queryClient.getQueryData(["chat"]);
      queryClient.setQueryData(
        ["chat"],
        (prevChats: Message[]) => [...(prevChats || []), { role: "user", content: input }]
      );
      await createMessage(uuidv4(), input, "user", fileId);
    },
    async onSuccess(data) {
     await createMessage(uuidv4(), data, "assistant", fileId);
    },
    onSettled(data) {
      const prevChats: Message[] | undefined = queryClient.getQueryData(["chat"]);
      queryClient.setQueryData(
        ["chat"],
        (prevChats: Message[]) => [...(prevChats || []), { role: "assistant", content: data }]
      );
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };


  // if (pdfLoading) {
  //   return (
  //     <div className="relative min-h-full flex flex-col justify-between gap-2 divide-y">
  //       <div className="flex-1 flex justify-center items-center flex-col mb-28">
  //         <div className="flex flex-col items-center gap-2">
  //           <span className="loading loading-spinner loading-lg text-black dark:text-white" />
  //           <h3 className="text-xl font-semibold">Loading</h3>
  //           <p className="text-zinc-400 dark:text-zinc-200 text-sn">
  //             Perparing Chats
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (aiError) {
  //   console.log(aiError.message, aiError.cause);
  //   return (
  //     <div className="relative min-h-full flex flex-col justify-between gap-2 divide-y">
  //       <div className="flex-1 flex justify-center items-center flex-col mb-28">
  //         <div className="flex flex-col items-center gap-2">
  //           <BiXCircle className="text-red-500 size-[50px]" />
  //           <h3 className="text-xl font-semibold">Error Loading Chats</h3>
  //           <p className="text-zinc-400 dark:text-zinc-200 text-sn">
  //             Please try again later
  //           </p>
  //           <Link href="/dashboard" className="flex items-center gap-1.5">
  //             <BiChevronLeft /> Back
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  console.log(messages)

  return (
    <div className="relative w-full max-md:border-t md:border-l h-[100dvh] md:h-[calc(100dvh-50px)] px-2 flex flex-col">
      {/* <div className="self-center flex gap-x-2 items-center"  >
      <p>Show PDF</p>
      <Switch checked={pdfVisible} onCheckedChange={setPdfVisible} />
    </div> */}

      <Messages fileId={fileId} chats={messages} />
      <div className="absolute bottom-2 left-[50%] -translate-x-[50%] w-full flex gap-4 items-center justify-center px-4">
        <Input
          placeholder="Let's get chatting!"
          className="max-w-[1000px] h-12"
          onChange={handleInputChange}
        />
        <BiSend className="cursor-pointer text-2xl" onClick={() => handleSend()} />
      </div>
    </div>
  );
};

export default Chat;
