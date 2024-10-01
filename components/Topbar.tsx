import { auth } from "@/auth";
import { prisma } from "@/lib/utils/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const Topbar = async () => {
  const session = await auth();

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email!,
    },
  });

  return (
    <div className="border-b h-10 w-full flex justify-between items-center px-2">
      <Link href={'/dashboard'} className="font-bold text-xl">Aura</Link>
      {user ? (
        <Avatar className="size-8">
          <AvatarImage src={user.photo!} />
          <AvatarFallback>{user.username}</AvatarFallback>
        </Avatar>
      ) : (
        <ul className="flex gap-2 text-sm">
          <li>Pricing</li>
          <li>About Developer</li>
        </ul>
      )}
    </div>
  );
};

export default Topbar;
