import { getFileMessages } from "@/lib/utils/actions";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef } from "react";
import { BiMessage } from "react-icons/bi";
import Message from "./Message";
import { Message as MessageProps } from "@/types";

interface MessagesProps {
  fileId: string;
  messages: MessageProps[];
  isLoading: boolean;
  isPending: boolean;
}

const Messages = ({ isLoading, isPending }: MessagesProps) => {

  // AI loading  response
  const loadingMessages: MessageProps = {
    id: "loading-message",
    content: "loading...",
    role: "assistant",
  };

  if (isLoading) {
    return (
      <div className="relative min-h-full flex flex-col items-center justify-center gap-2 divide-y">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <span className="loading loading-spinner loading-lg text-black dark:text-white" />
            <h3 className="text-xl font-semibold">Almost done...</h3>
          </div>
        </div>
      </div>
    );
  }

  const queryClient = useQueryClient();

  const messages: MessageProps[] | undefined = queryClient.getQueryData([
    "chat",
  ]);

  // both the loading response and the messages array
  const combinedMessages = [
    ...(messages ?? []),
    ...(isPending ? [loadingMessages] : []),
  ];
  const bottomRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [combinedMessages]);

  return (
    <div className="flex flex-col flex-1 gap-4 p-4 h-[calc(100%-100px)] overflow-y-scroll">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message: MessageProps) => (
          <Message key={message.id} message={message} />
        ))
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <BiMessage className="h-8 w-8 text-zinc-300" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-zinc-500 text-md">
            Ask your first question to get started!
          </p>
        </div>
      )}
      <span ref={bottomRef} />
    </div>
  );
};

export default Messages;
