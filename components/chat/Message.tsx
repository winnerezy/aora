import { Message as MessageProps } from "@prisma/client"
import cn from "classnames"
import { marked } from "marked"

const Message = ({ message }: { message: MessageProps }) => {
  return (
    <div className={cn("w-fit max-w-[50%] max-h-full p-2 rounded-md bg-zinc-600", message.isUserMessage ? "self-end" : "self-start")}>
        <p className="font-medium text-md tracking-wider text-wrap">{message.text}</p>
    </div>
  )
}

export default Message