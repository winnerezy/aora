import { Message as MessageProps } from "@prisma/client";
import cn from "classnames";
import { marked } from "marked";
import { ForwardedRef } from "react";

const Message = ({ message }: { message: Partial<MessageProps>}) => {
  return (
    <div
      className={cn(
        "w-full max-w-[60%] max-h-full p-2 rounded-md bg-zinc-600",
        message.isUserMessage ? "self-end" : "self-start"
      )}
    >
      <p
        className="font-medium text-xs md:text-md tracking-widest text-wrap"
        // dangerouslySetInnerHTML={{ __html: marked(message.text!) }}
      >{message.text!}</p>
    </div>
  );
};

export default Message;
