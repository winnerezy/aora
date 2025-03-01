import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  return (
    <div className="px-4 flex flex-col gap-6 min-h-screen mx-auto items-center w-full max-w-6x;">
      <h1 className="font-dancing text-4xl sm:text-5xl md:text-7xl font-bold mt-48 text-center">
        A Pretty Fast Math Tutor
      </h1>
      <form
        action={async () => {
          "use server";
          redirect("/signin");
        }}
      >
        <Button type="submit" className="w-48 h-10">
          Get Started
        </Button>
      </form>
      <div>
        <h2 className="text-2xl font-semibold">
          Learn Better Understand Faster
        </h2>
      </div>
    </div>
  );
};

export default page;
