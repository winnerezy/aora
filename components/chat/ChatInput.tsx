import { useContext, useEffect, useState } from "react"
import { BiSend } from "react-icons/bi"
import TextArea from "react-textarea-autosize"
import { ChatContext } from "./ChatContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { pdfjs } from "react-pdf"
import { gemini } from "@/lib/gemini"
import axios from "axios"

interface ChatInputProps {
  isDisabled: boolean
  fileUrl: string
  fileId: string
}

const ChatInput = ({ isDisabled, fileUrl, fileId }: ChatInputProps) => {

  const [pdfText, setPdfText] = useState<string>("")
  const { message, addMessage, handleInputChange, isLoading, setMessage, setIsUserMessage } = useContext(ChatContext)
  9
  const { data, isLoading: pdfLoading, error } = useQuery({
    queryKey: ["ai"], queryFn: async () => {
      const res = await fetch(fileUrl);
      const resBlob = await res.blob()
      const fileReader = new FileReader()
      fileReader.onload = onLoadFile
      fileReader.readAsArrayBuffer(resBlob)
      return resBlob
    }
  })

  function onLoadFile(event: ProgressEvent<FileReader>) {
    const typedArray = new Uint8Array(event.target?.result as ArrayBuffer)
    pdfjs.getDocument({
      data: typedArray
    }).promise.then((pdf) => {
      let text = ""
      for (let i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then((page) => {
          page.getTextContent().then((content) => {
            content.items.forEach((item) => {
              if ('str' in item) {
                text += item.str + " ";
                setPdfText(text)
              }
            });
          })
        })
      }
    })
  }

  const queryClient = useQueryClient()

  const { mutate: handleSubmit } = useMutation({
    mutationKey: ["chat"], mutationFn: async (newMessage: string) => {
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

      const result = await chat.sendMessage(newMessage);
      const response = result.response;
      return response.text();
    },
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: ['infinite'] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(['infinite']);

      // Optimistically update the messages
      queryClient.setQueryData(['infinite'], (oldData: any) => {
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            messages: [...page.messages, {message: newMessage, isUserMessage: true}],
          })),
        };
      });
      setMessage("")

      return { previousMessages };
    },
    onError: (error, newMessage, context: any) => {
      if (context?.previousMessages) {
        setMessage(context.previousMessages);
      }
    },
    onSuccess: async (responseText, newMessage) => {
      queryClient.invalidateQueries({ queryKey: ['infinite'], type: 'active' });
      await axios.post('/api/message', {
        fileId,
        message: responseText,
        isUserMessage: false
      })
      setMessage("")
    },
    onSettled: () => {
      setMessage("");
    },
  });

  return (
    <div className="absolute bottom-8 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <TextArea className="textarea w-full resize-none py-3 pr-12 text-base" value={message} onChange={handleInputChange} autoFocus rows={1} maxRows={4} placeholder="Enter your question" />
              <button disabled={isDisabled || isLoading || message.length === 0} type="button" onClick={() => handleSubmit(message)} className="btn absolute bottom-1.5 right-[8px]"><BiSend /></button>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}

export default ChatInput