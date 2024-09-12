'use client'

import { signout } from "@/lib/utils/actions";
import { User } from "@prisma/client";
import Image from "next/image";
import { BiLogOut } from "react-icons/bi";

const UserAccount = async ({ user }: { user: User }) => {

  return (



<div className="dropdown dropdown-end">
<Image tabIndex={0} role="button" className="size-10 border rounded-full mx-1" src={user.photo} alt={user.username!} width={1000} height={1000}/>
  <ul tabIndex={0} className="dropdown-content menu rounded-box z-[1] w-52 p-2 bg-background shadow-md">
    <li className="space-x-2" onClick={() => signout()}><p><BiLogOut/>Log Out</p></li>
  
  </ul>
</div>


  );
};

export default UserAccount;
