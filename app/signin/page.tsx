import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import React from "react";
import { FcGoogle } from "react-icons/fc";

export const metadata: Metadata = {
  title: "Mirio | Sign In",
  description: "A pretty fast math tutor",
};

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-4xl">Sign In To Mirio</h1>

        <Button variant={"outline"}>
          <FcGoogle />
          Sign In With Google
        </Button>
      </div>
    </div>
  );
};

export default page;
