import { getFileMessages } from "@/lib/utils/actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import Message from "./Message";
import Skeleton from "react-loading-skeleton";
import { BiMessage } from "react-icons/bi";

interface MessagesProps {
  fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {
  const { data, error, isLoading, fetchNextPage } = useInfiniteQuery({
    initialPageParam: null,
    queryKey: ["infinite"],
    queryFn: () => getFileMessages(fileId, 10),
    getNextPageParam: (lastPage) => {
      lastPage.nextCursor;
    },
  });

  const messages = data?.pages.flatMap((page) => page.messages);

  return (
    <div className="max-h-[calc(100vh-3.5rem-7rem)] flex flex-ol flex-col-reverse flex-1 gap-4 p-4 overflow-y-auto">
      {messages && messages.length !== 0 ? (
        messages.map((message) => {
          return <Message message={message} key={message.id} />;
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-16 self-start w-24" />
          <Skeleton className="h-16 self-end w-24" />
          <Skeleton className="h-16 self-startnw-24" />
          <Skeleton className="h-16 self-end w-24" />
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
