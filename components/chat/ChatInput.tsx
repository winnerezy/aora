import { useContext, useEffect, useState } from "react"
import { BiSend } from "react-icons/bi"
import TextArea from "react-textarea-autosize"
import { ChatContext } from "./ChatContext"
import PdfJs from "pdfjs"
import { useQuery } from "@tanstack/react-query"
import { pdfjs } from "react-pdf"
import { gemini } from "@/lib/gemini"

interface ChatInputProps {
  isDisabled: boolean
  fileUrl: string
}

const ChatInput = ({ isDisabled, fileUrl }: ChatInputProps) => {

  const [question, setQuestion] = useState<string>("")
  const [pdfText, setPdfText] = useState<string>("")
  const { message, addMessage, handleInputChange, isLoading } = useContext(ChatContext)
  9
  const { data, isLoading: pdfLoading, error } = useQuery({
    queryKey: ["ai"], queryFn: async () => {
      const res = await fetch(fileUrl);
      const resBlob = await res.blob()
      const fileReader = new FileReader()
      fileReader.onload = onLoadFile
      fileReader.readAsArrayBuffer(resBlob)
    }
  })

  function onLoadFile(event: ProgressEvent<FileReader>) {
    const typedArray = new Uint8Array(event.target?.result as ArrayBuffer)
    pdfjs.getDocument({
      data: typedArray
    }).promise.then((pdf) => {
      console.log("loaded pdf", pdf.numPages)
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

  // Extract text from PDF
  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const model = gemini.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `Hi act as a tutor and only answer questions about this text ${pdfText}.` }],
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

    const msg = question;

    const result = await chat.sendMessage(msg);
    const response = result.response;
    const text = response.text();
    console.log(text);
  };
  return (
    <div className="absolute bottom-8 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <TextArea className="textarea w-full resize-none py-3 pr-12 text-base" value={question} onChange={handleQuestionChange} autoFocus rows={1} maxRows={4} placeholder="Enter your question" />
              <button disabled={isDisabled || isLoading} onClick={async (e) => await handleSubmit(e)} className="btn absolute bottom-1.5 right-[8px]"><BiSend /></button>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}

export default ChatInput