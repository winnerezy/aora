"use client";

import { createMessage } from "@/lib/utils/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useChat } from "ai/react";
import Link from "next/link";
import {
  ChangeEventHandler,
  MouseEvent,
  MouseEventHandler,
  useState,
} from "react";
import { BiChevronLeft, BiSend, BiXCircle } from "react-icons/bi";
import { pdfjs } from "react-pdf";
import TextArea from "react-textarea-autosize";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Messages from "./Messages";
import { Message } from "@/types";

interface ChatProps {
  fileId: string;
  fileUrl: string;
}

const Chat = ({ fileId, fileUrl }: ChatProps) => {
  const [input, setInput] = useState("");
  const [pdfText, setPdfText] = useState<string>("");

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

  // const {
  //   messages,
  //   input,
  //   setInput,
  //   handleSubmit,
  //   handleInputChange,
  //   isLoading,
  // } = useChat({
  //   body: {
  //     fileId,
  //     pdfText,
  //   },
  //   onError: (error) => {
  //     setInput(input);
  //     return Toastify({
  //       text: error.message,
  //       duration: 3000,
  //     }).showToast();
  //   },

  //   // when ai fully responds user input and ai reponse save in the database
  //   onFinish: async (aiResponse) => {
  //     await createMessage(input, "user", fileId);
  //     await createMessage(aiResponse.content, "assistant", fileId);
  //   },
  // });

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
    mutationKey: ["chat"],
    mutationFn: async () => {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ pdfText, message: input }),
      });
      const ans = await res.json();
      return ans as Message;
    },
    onMutate() {
      setInput("");
      async () => await createMessage(input, "user", fileId);
      const prevChats: [] | undefined = queryClient.getQueryData(["chat"]);
      queryClient.setQueryData(
        ["chat"],
        [prevChats, { role: "user", part: input }]
      );
    },
    onSuccess(data) {
      async () => await createMessage(data.part, "assistant", fileId);
    },
    onSettled(data) {
      const prevChats: [] | undefined = queryClient.getQueryData(["chat"]);
      queryClient.setQueryData(
        ["chat"],
        [prevChats, { role: "assistant", part: data }]
      );
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  if (pdfLoading) {
    return (
      <div className="relative min-h-full flex flex-col justify-between gap-2 divide-y">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <span className="loading loading-spinner loading-lg text-black dark:text-white" />
            <h3 className="text-xl font-semibold">Loading</h3>
            <p className="text-zinc-400 dark:text-zinc-200 text-sn">
              Perparing Chats
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (aiError) {
    console.log(aiError.message, aiError.cause);
    return (
      <div className="relative min-h-full flex flex-col justify-between gap-2 divide-y">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <BiXCircle className="text-red-500 size-[50px]" />
            <h3 className="text-xl font-semibold">Error Loading Chats</h3>
            <p className="text-zinc-400 dark:text-zinc-200 text-sn">
              Please try again later
            </p>
            <Link href="/dashboard" className="flex items-center gap-1.5">
              <BiChevronLeft /> Back
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-full h-[calc(100%-100px)] flex flex-col justify-between gap-2 overflow-hidden">
      <Messages
        fileId={fileId}
        messages={messages}
        isLoading={isLoading}
        isPending={isPending}
      />
      <div className="absolute bottom-0 w-full h-[50px] flex items-center">
        <TextArea
          className="flex-shrink-0 w-full resize-none text-base bg-white/70 dark:bg-black/70 h-[50px] textarea"
          value={input}
          onChange={handleInputChange}
          autoFocus
          rows={1}
          maxRows={4}
          placeholder="Enter your question"
        />
        <button
          disabled={isPending || input.length === 0}
          type="button"
          onClick={() => handleSend()}
          className="absolute bg-transparent text-foreground right-[20px]"
        >
          <BiSend className="size-6" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
