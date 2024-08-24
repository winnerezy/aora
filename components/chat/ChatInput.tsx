import { useContext, useEffect, useState } from "react";
import { BiSend } from "react-icons/bi";
import TextArea from "react-textarea-autosize";
import { ChatContext } from "./ChatContext";

interface ChatInputProps {
  isDisabled: boolean;
  fileUrl: string;
  fileId: string;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {

  const { handleInputChange, message, isLoading, addMessage } = useContext(ChatContext)
  
  return (
    <div className="absolute bottom-8 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <TextArea
                className="textarea w-full resize-none py-3 pr-12 text-base"
                value={message}
                onChange={handleInputChange}
                autoFocus
                rows={1}
                maxRows={4}
                placeholder="Enter your question"
              />
              <button
                disabled={isDisabled || isLoading || message.length === 0}
                type="button"
                onClick={() => addMessage({ message, isUserMessage: true })}
                className="btn absolute bottom-1.5 right-[8px]"
              >
                <BiSend />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
