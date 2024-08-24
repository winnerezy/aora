import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { pdfjs } from "react-pdf";
import { gemini } from "@/lib/gemini";
import { Message as MessageProps } from "@prisma/client";

type ContextType = {
  addMessage: ({
    message,
    isUserMessage,
  }: {
    message: string;
    isUserMessage: boolean;
  }) => void;
  message: string;
  setIsUserMessage: Dispatch<SetStateAction<boolean>>;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<ContextType>({
  addMessage: () => {},
  message: "",
  setIsUserMessage: () => {},
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  fileId: string;
  fileUrl: string;
  children: React.ReactNode;
}

interface PaginatedProps {
  pages: { messages: MessageProps[] }[];
  messages: MessageProps[];
}

export const ChatContextProvider = ({ fileId, fileUrl, children }: Props) => {
  const [message, setMessage] = useState<string>("");

  const [isUserMessage, setIsUserMessage] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const [pdfText, setPdfText] = useState<string>("");

  const {
    data,
    isLoading: pdfLoading,
    error,
  } = useQuery({
    queryKey: ["ai"],
    queryFn: async () => {
      const res = await fetch(fileUrl);
      const resBlob = await res.blob();
      const fileReader = new FileReader();
      fileReader.onload = onLoadFile;
      fileReader.readAsArrayBuffer(resBlob);
      return resBlob;
    },
  });

  function onLoadFile(event: ProgressEvent<FileReader>) {
    const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);
    pdfjs
      .getDocument({
        data: typedArray,
      })
      .promise.then((pdf) => {
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          pdf.getPage(i).then((page) => {
            page.getTextContent().then((content) => {
              content.items.forEach((item) => {
                if ("str" in item) {
                  text += item.str + " ";
                  setPdfText(text);
                }
              });
            });
          });
        }
      });
  }

  const { data: messageData, mutate: sendMessage } = useMutation({
    mutationFn: async ({
      message,
      isUserMessage,
    }: {
      message: string;
      isUserMessage: boolean;
    }) => {
      const res = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
          isUserMessage,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const model = gemini.getGenerativeModel({ model: "gemini-pro" });

      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [
              {
                text: `Hi act as a tutor and answer questions about this text explain with examples if needed and also you can get data from the internet as well ${pdfText} if anything else say that this question is not relevant to the PDF.`,
              },
            ],
          },
          {
            role: "model",
            parts: [{ text: "Alright, what would you like to know?" }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 100,
        },
      });
      const result = await chat.sendMessage(message);
      const response = result.response;

      await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message: response.text(),
          isUserMessage: false,
        }),
      });
      return response.text();
    },
    onMutate: async ({ message, isUserMessage }) => {
      setMessage("");
      setIsLoading(true);
      await queryClient.cancelQueries({ queryKey: ["messages", fileId] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<{
        pages: { messages: MessageProps[] }[];
        messages: MessageProps[];
      }>(["messages", fileId]);

      // Optimistically update to the new value
      const newMessage = {
        id: crypto.randomUUID(),
        isUserMessage,
        text: message,
      };

      queryClient.setQueryData<PaginatedProps | undefined>(
        ["messages", fileId],
        (old) => {
          // Check if `old` exists and is structured correctly
          const oldMessages = old!.messages;
          if (old && old.pages) {
            const newMessagesArray = [
              ...(old.pages[0]?.messages || []),
              newMessage,
            ];
            return newMessagesArray;
          } else {
            // Initialize structure if `old` is undefined or malformed
            return { messages: [newMessage, ...oldMessages] };
          }
        }
      );

      // Return the context object with the snapshotted value
      return { previousMessages };
    },
    onSuccess: () => {
      setMessage("");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", fileId] });
      setIsLoading(false);
    },
    onError: (error) => {
      console.log("Error found ", error.message);
    },
  });

  const addMessage = () => sendMessage({ message, isUserMessage });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        setIsUserMessage,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
