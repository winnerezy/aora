import { Message as MessageProps } from "ai/react";
import cn from "classnames";
import { marked } from "marked";

const Message = ({ message }: { message: MessageProps}) => {
  return (
    <div
      className={cn(
        "w-max max-w-[60%] max-h-full p-2 rounded-md bg-zinc-600",
        message.role === "user" ? "self-end" : "self-start"
      )}
    >
      <p
        className="font-medium text-xs md:text-md tracking-widest text-wrap"
        dangerouslySetInnerHTML={{ __html: marked(message.content) }}
      ></p>
    </div>
  );
};

export default Message;
