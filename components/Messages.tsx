
import { cn } from "@/lib/utils";
import { Message } from "@prisma/client";
import { useEffect, useRef } from "react";

interface MessagesProps { fileId: string, chats: Message[] }

const Messages = ({ fileId, chats }: MessagesProps) => {
  const bottomRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const combinedMessages = [
    ...(chats ? chats : [])
  ]

  return (
    <div className="h-[calc(100dvh-5rem)] md:h-[calc(100dvh-8rem)] flex flex-col gap-2 py-2">
      {chats && (
        <section className="flex flex-col gap-2 overflow-y-auto">
          {combinedMessages.map((message) => (
            <div
            key={message.id}
              className={cn(
                "bg-card rounded-2xl w-fit max-w-[400px] md:max-w-[600px] font-light text-sm py-2 px-4",
                message.role === "user" ? "self-end" : "self-start"
              )}
            >
              {message.content}
            </div>
          ))}
          <span ref={bottomRef} />
        </section>
      )}
    </div>
  );
};

export default Messages;
