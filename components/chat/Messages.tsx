import { getFileMessages } from "@/lib/utils/actions";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Message from "./Message";
import Skeleton from "react-loading-skeleton";
import { BiMessage } from "react-icons/bi";
import { useEffect } from "react";
import { Message as MessageProp } from "@prisma/client";

interface MessagesProps {
  fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["messages", fileId],
    queryFn: () => getFileMessages(fileId, 10),
  });

  const queryClient = useQueryClient();
  const cachedData: { messages: MessageProp[] } | undefined =
    queryClient.getQueryData(["messages", fileId]);

  return (
    <div className="max-h-[calc(100vh-3.5rem-7rem)] flex flex-ol flex-col-reverse flex-1 gap-4 p-4 overflow-y-auto">
      {cachedData && cachedData.messages.length !== 0 ? (
        cachedData.messages.map((message) => {
          return <Message message={message} key={message.id} />;
        })
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
