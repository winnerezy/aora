'use client'

import { CreateChatModal } from "@/components/CreateChatModal";
import { DashboardBar } from "@/components/DashboardBar";
import { getUserFiles } from "@/lib/utils/actions";
import { useMutation, useQuery } from "@tanstack/react-query";

const Dashboard = () => {

  const { data } = useQuery({queryKey: ['files'], queryFn: getUserFiles})
  console.log(data)
  return (
    <section className="flex flex-col w-full gap-4 h-full p-4">
      <DashboardBar />
      <div className="w-full gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-self-center">
        <article className="h-[150px] rounded-md border"></article>
        <article className="h-[150px] rounded-md border"></article>
        <article className="h-[150px] rounded-md border"></article>
      </div>
      <CreateChatModal />
    </section>
  );
};

export default Dashboard;
