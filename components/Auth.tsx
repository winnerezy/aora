'use client'
import { signin } from "@/lib/utils/actions";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {

    const handleSignIn = async (provider: string) => {
        await signin(provider)
    }

  return (
    <div className='relative w-[600px] h-[500px] bg-gray-700 rounded-md flex flex-col items-center justify-center gap-8 p-4'>
        <h3 className="text-4xl font-semibold absolute top-8">Welcome To Aora</h3>
        <button onClick={() => handleSignIn("google")} className="bg-white w-[70%] h-14 rounded-md p-2 flex gap-2 items-center justify-center">
            <FcGoogle className="size-8"/>
            <span className="text-black font-medium">Sign In WIth Google</span>
        </button>    
        <button onClick={() => handleSignIn("github")} className="bg-white w-[70%] h-14 rounded-md p-2 flex gap-2 items-center justify-center">
            <FaGithub className="size-8 text-black"/>
            <span className="text-black font-medium">Sign In WIth Github</span>
        </button> 
    </div>
  )
}

export default Auth