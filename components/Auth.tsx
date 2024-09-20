'use client'
import { signin } from "@/lib/utils/actions";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {

    const handleSignIn = async (provider: string) => {
        await signin(provider)
    }

  return (
    <div className='border rounded-lg relative w-[500px] h-[300px] flex flex-col items-center justify-center gap-4 p-4'>
        <h3 className="text-2xl font-semibold absolute top-4">Welcome To Aora</h3>
        <button onClick={() => handleSignIn("google")} className="bg-transparent border hover:bg-button/10 w-[80%] h-12 rounded-md p-2 flex gap-2 items-center justify-center">
            <FcGoogle className="size-8"/>
            <span className="font-medium">Sign In WIth Google</span>
        </button>    
        <button onClick={() => handleSignIn("github")} className="bg-transparent border hover:bg-button/10 w-[80%] h-12 rounded-md p-2 flex gap-2 items-center justify-center">
            <FaGithub className="size-8 text-foreground"/>
            <span className="font-medium">Sign In WIth Github</span>
        </button> 
    </div>
  )
}

export default Auth