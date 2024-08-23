import { useMutation } from "@tanstack/react-query";
import { createContext, useState } from "react";

type ContextType = {
    addMessage: () => void
    message: string
    handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    isLoading: boolean
}

export const ChatContext = createContext<ContextType>({
    addMessage: () => { },
    message: "",
    handleInputChange: () => { },
    isLoading: false
})

interface Props {
    fileId: string,
    children: React.ReactNode
}

export const ChatContextProvider = ({ fileId, children }: Props) => {

    const [message, setMessage] = useState<string>("")

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { mutate: sendMessage } = useMutation({
        mutationFn: async ({message}: {message: string}) => {
            const res = await fetch('/api/message', { 
                method: 'POST',
                body: JSON.stringify({ 
                    fileId, message 
                }) 
            })
            if(!res.ok){
                throw new Error("Failed to send message")
            }
            return res.body

        }
    })

    const addMessage = () => sendMessage({ message })

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value)
    }



    return (
        <ChatContext.Provider value={{
            addMessage,
            message,
            handleInputChange,
            isLoading
        }}>
            {children}
        </ChatContext.Provider>
    )
}