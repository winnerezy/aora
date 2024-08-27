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
  const { handleInputChange, message, isLoading, addMessage } =
    useContext(ChatContext);

  return (
    <div className="absolute bottom-8 left-0 w-full mb-12">
      <TextArea
        className="textarea flex-shrink-0 w-full resize-none py-3 pr-12 text-base"
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
        className="btn absolute right-[8px]"
      >
        <BiSend />
      </button>
    </div>
  );
};

export default ChatInput;
