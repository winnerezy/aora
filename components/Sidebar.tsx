import Link from "next/link"

export const Sidebar = () => {
  return (
    <aside className="w-[300px] flex flex-col gap-4 px-4 py-2 h-full bg-secondary-content">
      <span className="text-sm font-bold tracking-wide">Dashbaord</span>
      <Link href="/" className="rounded-full p-2 hover:bg-neutral">Create New Chat</Link>
      <Link href="/" className="rounded-full p-2 hover:bg-neutral">Explore Aora</Link>
      <Link href="/" className="rounded-full p-2 hover:bg-neutral">Contact</Link>
      <hr />
      <span className="text-sm font-bold tracking-wide">Recent Chats</span>
      <div className="flex flex-col gap-4 overflow-scroll">
        <Link href="/" className="rounded-full p-2 hover:bg-neutral">My Chat</Link>
        <Link href="/" className="rounded-full p-2 hover:bg-neutral">My Chat</Link>
        <Link href="/" className="rounded-full p-2 hover:bg-neutral">My Chat</Link>
        <Link href="/" className="rounded-full p-2 hover:bg-neutral">My Chat</Link>
        <Link href="/" className="rounded-full p-2 hover:bg-neutral">My Chat</Link>
        <Link href="/" className="rounded-full p-2 hover:bg-neutral">My Chat</Link>
        <Link href="/" className="rounded-full p-2 hover:bg-neutral">My Chat</Link>
        <Link href="/" className="rounded-full p-2 hover:bg-neutral">My Chat</Link>
        <Link href="/" className="rounded-full p-2 hover:bg-neutral">My Chat</Link>
      </div>
    </aside>
  );
};
