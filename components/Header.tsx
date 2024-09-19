import Link from "next/link";
import UserAccount from "@/components/UserAccount";
import { getCurrentUser } from "@/lib/utils/actions";

const Header = async () => {
  const user = await getCurrentUser();
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b h-14">
      <Link href="/dashboard">
        <span className="text-2xl font-bold tracking-wide">Aora</span>
      </Link>
      {user && <UserAccount user={user} />}
    </header>
  );
};

export default Header;
