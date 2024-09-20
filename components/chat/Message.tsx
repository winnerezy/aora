import { Message as MessageProps } from "@/types";
import cn from "classnames";
import { marked } from "marked";

const Message = ({ message }: { message: MessageProps}) => {
  return (
    <div
      className={cn(
        "bg-card w-max max-w-[60%] max-h-full p-2 rounded-md",
        message.role === "user" ? "self-end" : "self-start"
      )}
    >
     {
      message.content ? (
        <p
        className="font-medium text-xs md:text-md tracking-widest text-wrap"
        dangerouslySetInnerHTML={{ __html: marked(message.content) }}
      >
      </p>
      ) : <p>{message.content}</p>
     }
    </div>
  );
};

export default Message;
