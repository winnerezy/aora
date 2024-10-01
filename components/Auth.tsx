'use client'
import { Button } from "./ui/button";
import { signin } from "@/lib/utils/actions";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {

    const handleSignIn = async (provider: string) => {
        await signin(provider)
    }
  return (
    <div className="w-[400px] h-[200px] border rounded-md flex flex-col items-center justify-center gap-2">
      <Button
        onClick={() => handleSignIn("google")}
        className="bg-transparent border hover:bg-button/10 w-[80%] h-12 rounded-md p-2 flex gap-2 items-center justify-center text-black"
      >
        <FcGoogle className="size-8" />
        <span className="font-medium">Sign In With Google</span>
      </Button>
      <Button
        onClick={() => handleSignIn("github")}
        className="bg-transparent border hover:bg-button/10 w-[80%] h-12 rounded-md p-2 flex gap-2 items-center justify-center text-black"
      >
        <FaGithub className="size-8 text-foreground" />
        <span className="font-medium">Sign In With Github</span>
      </Button>
    </div>
  );
};

export default Auth;
