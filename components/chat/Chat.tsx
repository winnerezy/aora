"use client";

import { useChat } from "ai/react";
import Link from "next/link";
import { BiChevronLeft, BiSend, BiXCircle } from "react-icons/bi";
import TextArea from "react-textarea-autosize";
import { ChatContextProvider } from "./ChatContext";
import Messages from "./Messages";
import { pdfjs } from "react-pdf";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { createMessage } from "@/lib/utils/actions";

interface ChatProps {
  fileId: string;
  fileUrl: string;
}

const Chat = ({ fileId, fileUrl }: ChatProps) => {
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

  const { messages, input, setInput, handleSubmit, handleInputChange, isLoading } =
    useChat({
      body: {
        fileId,
        pdfText
      },
      onError: (error) => {
        setInput(input)
        return Toastify({
          text: error.message,
          duration: 3000,
        }).showToast();
      },

      // when ai fully responds user input and ai reponse save in the database
      onFinish: async (aiResponse) => {
          await createMessage(input, "user", fileId)
          await createMessage(aiResponse.content, "assistant", fileId)
      },
    });

  if (pdfLoading) {
    return (
      <div className="relative min-h-full flex flex-col justify-between gap-2 divide-y">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <span className="loading loading-spinner loading-lg text-white" />
            <h3 className="text-xl font-semibold">Loading</h3>
            <p className="text-zinc-200 text-sn">Perparing Chats</p>
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
            <p className="text-zinc-200 text-sn">Please try again later</p>
            <Link href="/dashboard" className="flex items-center gap-1.5">
              <BiChevronLeft /> Back
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <ChatContextProvider fileId={fileId} fileUrl={fileUrl}>
      <div className="relative w-full min-h-full divide-y divide-zinc-200 flex flex-col justify-between gap-2 overflow-hidden">
        <div className="flex-1 justify-between flex flex-col mb-12">
          <Messages fileId={fileId} messages={messages} isLoading={isLoading} />
        </div>
        <div className="absolute bottom-8 left-0 w-full">
          <TextArea
            className="textarea flex-shrink-0 w-full resize-none py-3 pr-12 text-base"
            value={input}
            onChange={handleInputChange}
            autoFocus
            rows={1}
            maxRows={4}
            placeholder="Enter your question"
          />
          <button
            disabled={isLoading || input.length === 0}
            type="button"
            onClick={handleSubmit}
            className="btn absolute right-[8px]"
          >
            <BiSend />
          </button>
        </div>
      </div>
    </ChatContextProvider>
  );
};

export default Chat;
