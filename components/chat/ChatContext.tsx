import { useMutation } from "@tanstack/react-query";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type ContextType = {
    addMessage: ({ message, isUserMessage }: {message: string, isUserMessage: boolean}) => void
    message: string
    setMessage: Dispatch<SetStateAction<string>>
    setIsUserMessage: Dispatch<SetStateAction<boolean>>
    handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    isLoading: boolean
}

export const ChatContext = createContext<ContextType>({
    addMessage: () => { },
    message: "",
    setMessage: () => {},
    setIsUserMessage: () => {},
    handleInputChange: () => { },
    isLoading: false
})

interface Props {
    fileId: string,
    children: React.ReactNode
}

export const ChatContextProvider = ({ fileId, children }: Props) => {

    const [message, setMessage] = useState<string>("")

    const [isUserMessage, setIsUserMessage] = useState<boolean>(true)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { mutate: sendMessage } = useMutation({
        mutationFn: async ({message, isUserMessage}: {message: string, isUserMessage: boolean}) => {
            const res = await fetch('/api/message', { 
                method: 'POST',
                body: JSON.stringify({ 
                    fileId, message, isUserMessage
                }) 
            })
            if(!res.ok){
                throw new Error("Failed to send message")
            }
            return res.body

        }
    })

    const addMessage = () => sendMessage({ message, isUserMessage })

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value)
    }



    return (
        <ChatContext.Provider value={{
            addMessage,
            message,
            setMessage,
            setIsUserMessage,
            handleInputChange,
            isLoading
        }}>
            {children}
        </ChatContext.Provider>
    )
}