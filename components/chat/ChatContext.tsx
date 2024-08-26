import {
  Updater,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { pdfjs } from "react-pdf";
import { gemini } from "@/lib/gemini";
import { Message, Message as MessageProps } from "@prisma/client";

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

type PaginatedProps = {
  pageParam: string[] | [undefined];
  pages: {
    messages: Partial<Message>[] | undefined;
  }[];
};

export const ChatContextProvider = ({ fileId, fileUrl, children }: Props) => {
  const [message, setMessage] = useState<string>("");

  const [isUserMessage, setIsUserMessage] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const [pdfText, setPdfText] = useState<string>("");

  const backupMessage = useRef("");

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

      const ans = await res.json();

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
          }
        ],
        generationConfig: {
          maxOutputTokens: 100,
        },
      });

      console.log(message)
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

      console.log(response.text())
      return response.text()

    },
    onMutate: async ({ message, isUserMessage }) => {
      backupMessage.current = message;

      setMessage("");
      setIsLoading(true);
      await queryClient.cancelQueries({ queryKey: ["messages", fileId] });

      // Snapshot the previous value
      const previousMessages: PaginatedProps | undefined =
        queryClient.getQueryData(["messages"]);

      // Optimistically update to the new value
      const newMessage = {
        id: crypto.randomUUID(),
        isUserMessage,
        text: message,
        createdAt: new Date()
      };

      console.log(newMessage)
      queryClient.setQueryData<PaginatedProps | undefined>(
        ["messages", fileId],
        (old: PaginatedProps | undefined) => {
          // Check if `old` exists and is structured correctly
          if (!old) {
            return {
              pageParam: [],
              pages: [],
            };
          }
          let newPages = [...old?.pages];

          let latestPage = newPages[0];

          latestPage.messages = [newMessage, ...latestPage.messages!];

          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        }
      );

      setIsLoading(true);
      // Return the context object with the snapshotted value
      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess:  (response) => {
      setMessage("");
      setIsLoading(false);

      // Add the AI response to the messages
      const newAIMessage = {
          id: crypto.randomUUID(),
          isUserMessage: false,
          text: response,  // Directly use the AI response
          createdAt: new Date(Date.now()),
      };

      queryClient.setQueryData<PaginatedProps | undefined>(
          ["messages", fileId],
          (old: PaginatedProps | undefined) => {
              if (!old) {
                  return {
                      pageParam: [],
                      pages: [],
                  };
              }
              let newPages = [...old.pages];
              let latestPage = newPages[0];
              latestPage.messages = [newAIMessage, ...latestPage.messages!];
              newPages[0] = latestPage;

              return {
                  ...old,
                  pages: newPages,
              };
          }
      );
    },
    onSettled: () => {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["messages", fileId] });
    },
    onError: (error, _, context) => {
      console.log("Error found ", error.message);
      setMessage(backupMessage.current);
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
