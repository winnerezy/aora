import { getFileMessages } from "@/lib/utils/actions";
import {
  useInfiniteQuery
} from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { BiMessage } from "react-icons/bi";
import { useInView } from "react-intersection-observer";
import Message from "./Message";

interface MessagesProps {
  fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {

  const {
    data,
    isLoading,
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

  const { ref, inView } = useInView();

  const bottomRef = useRef<HTMLDivElement | null>(null)

  // get older chats when scrolling up
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if(bottomRef.current){
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return (
    <div className="relative max-h-[calc(100vh-3.5rem-7rem)] flex flex-col flex-1 gap-4 p-4 overflow-y-auto">
      <span style={{ visibility: "hidden" }} ref={ref}></span>
      {data && data.pages ? (
        data.pages.sort((a, b) => a.messages[0].createdAt.getTime() - b.messages[0].createdAt.getTime()).map((page) => (
          <React.Fragment key={page.nextCursor ?? "lastPage"}>

            {isFetchingNextPage && (
              <div className="flex flex-col items-center gap-2 absolute top-2 left-[50%] -tanslate-x-[50%]">
                <span className="loading loading-spinner loading-lg text-white" />
              </div>
            )}
            <div className="w-full flex flex-col gap-4">
              {page.messages.map((message) => {
                return <Message message={message} key={message.id} />;
              })}
            <div ref={bottomRef}/>
            </div>
          </React.Fragment >
        ))
      ) : isLoading ? (
        <div className="relative min-h-full flex flex-col justify-between gap-2 divide-y">
          <div className="flex-1 flex justify-center items-center flex-col mb-28">
            <div className="flex flex-col items-center gap-2">
              <span className="loading loading-spinner loading-lg text-white" />
              <h3 className="text-xl font-semibold">Almost Done...</h3>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <BiMessage className="h-8 w-8 text-zinc-300" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-zinc-500 text-md">
            Ask your first question to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
