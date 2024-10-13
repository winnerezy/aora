import { auth, signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prisma } from "@/lib/utils/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

const Topbar = async () => {
  const session = await auth();

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email!,
    },
  });

  if(!user){
    redirect("/sign-in")
  }

  return (
    <div className="border-b h-10 w-full flex justify-between items-center px-2">
      <Link href={'/dashboard'} className="font-bold text-xl">Aora</Link>
     <div className="flex items-center space-x-4">
     {user ? (
        <Avatar className="size-8">
          <AvatarImage src={user.photo!} />
          <AvatarFallback>{user.username}</AvatarFallback>
        </Avatar>
      ) : (
        null
      )}
      <form action={async () => {
        'use server'
        await signOut()
      }}>
        <button type="submit">Log Out</button>
      </form>
     </div>
    </div>
  );
};

export default Topbar;
