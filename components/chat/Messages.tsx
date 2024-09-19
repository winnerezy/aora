import { getFileMessages } from "@/lib/utils/actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useEffect, useRef } from "react";
import { BiMessage } from "react-icons/bi";
import Message from "./Message";
import { Message as MessageProps, useChat } from "ai/react";

const Messages = ({
  fileId,
  messages,
  isLoading,
}: {
  fileId: string;
  messages: MessageProps[];
  isLoading: boolean;
}) => {
  // const { isLoading: isAILoading } = useContext(ChatContext)
  const {
    data,
    isLoading: messagesLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    initialPageParam: undefined,
    queryKey: ["messages", fileId],
    queryFn: async ({ pageParam }: { pageParam?: string }) =>
      await getFileMessages(fileId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? "",
  });

  // AI loading  response
  const loadingMessages: MessageProps = {
    id: "loading-message",
    content: "loading...",
    role: "assistant",
  };

  if (messagesLoading) {
    return (
      <div className="relative min-h-full flex flex-col items-center justify-center gap-2 divide-y">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <span className="loading loading-spinner loading-lg text-black dark:text-white" />
            <h3 className="text-xl font-semibold">Almist done...</h3>
          </div>
        </div>
      </div>
    );
  }

  const prevMessages: MessageProps[] = data!.pages!.flatMap(
    (page) => page.messages
  );

  // both the loading response and the messages array
  const combinedMessages = [
    ...(prevMessages.reverse() ?? []),
    ...(messages.sort() ?? []),
    ...(isLoading ? [loadingMessages] : []),
  ];
  // const { ref, inView } = useInView();

  // const bottomRef = useRef<HTMLSpanElement | null>(null);

 // get older chats when scrolling up
  // useEffect(() => {
  //   if (hasNextPage && inView) {
  //     fetchNextPage();
  //   }
  // }, [inView]);

  // useEffect(() => {
  //   if (bottomRef.current) {
  //     bottomRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [combinedMessages]);


  return (
    <div className="sm:max-h-[calc(100dvh-12rem)] flex flex-col flex-1 gap-4 p-4 overflow-y-auto">
      <span style={{ visibility: "hidden" }}></span>
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
       {/* <span ref={bottomRef}/> */}
    </div>
  );
};

export default Messages;
