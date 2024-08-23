'use client'

import { useQuery } from "@tanstack/react-query"
import ChatInput from "./ChatInput"
import Messages from "./Messages"
import { getFileUploadStatus } from "@/lib/utils/actions"
import { BiChevronLeft, BiXCircle } from "react-icons/bi"
import Link from "next/link"
import { ChatContextProvider } from "./ChatContext"

interface ChatProps {
  fileId: string
  fileUrl: string
}

const Chat = ({ fileId, fileUrl }: ChatProps) => {

  const { data, isLoading } = useQuery({
    queryKey: ["chat"], queryFn: () => getFileUploadStatus(fileId), refetchInterval: (data) =>
      data.state.data?.status === "SUCCESS" || data.state.data?.status === "FAILED" ? false : 500

  })

  if(isLoading){
    return (
      <div className="relative min-h-full flex flex-col justify-between gap-2 divide-y">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <span className="loading loading-spinner loading-lg text-white"/>
            <h3 className="text-xl font-semibold">Loading</h3>
            <p className="text-zinc-200 text-sn">Perparing PDF</p>

          </div>

        </div>
      </div>
    )
  }

  if(data?.status === "PROCESSING"){
    return (
      <div className="relative min-h-full flex flex-col justify-between gap-2 divide-y">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <span className="loading loading-spinner loading-lg text-white"/>
            <h3 className="text-xl font-semibold">Processing PDF</h3>
            <p className="text-zinc-200 text-sn">Won&apos;t take long.</p>

          </div>

        </div>
      </div>
    )
  }


if(data?.status === "FAILED"){
  return (
    <div className="relative min-h-full flex flex-col justify-between gap-2 divide-y">
    <div className="flex-1 flex justify-center items-center flex-col mb-28">
      <div className="flex flex-col items-center gap-2">
        <BiXCircle className="text-red-500 size-[50px]"/>
        <h3 className="text-xl font-semibold">Error Processing PDF</h3>
        <p className="text-zinc-200 text-sn">Please try again later</p>
        <Link href="/dashboard" className="flex items-center gap-1.5"><BiChevronLeft/> Back</Link>
      </div>
  
    </div>
    </div>
  )
}
  return (
   <ChatContextProvider fileId={fileId}>
     <div className="relative min-h-full divide-y divide-zinc-200 flex flex-col justify-between gap-2">
      <div className="flex-1 justify-between flex flex-col mb-28">
        <Messages fileId={fileId} />
      </div>
      <ChatInput isDisabled={isLoading} fileUrl={fileUrl} fileId={fileId}/>
    </div>
   </ChatContextProvider>
  )
}

export default Chat