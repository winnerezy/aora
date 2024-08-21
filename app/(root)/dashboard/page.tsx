import { CreateChatModal } from "@/components/CreateChatModal";
import Dashboard from "@/components/Dashboard";
import { DashboardBar } from "@/components/DashboardBar";

const Page = () => {

  return (
    <section className="flex flex-col w-full max-w-7xl mx-auto gap-4 h-full p-4">
      <DashboardBar />
    
      <CreateChatModal />
      <Dashboard/>
    </section>
  );
};

export default Page;
