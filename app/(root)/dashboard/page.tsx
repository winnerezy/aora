import { UploadFile } from "@/components/UploadFile";
import Dashboard from "@/components/Dashboard";
import { DashboardBar } from "@/components/DashboardBar";
import { getCurrentUser } from "@/lib/utils/actions";
import { auth } from "@/auth";

const Page = async () => {

  return (
    <section className="flex flex-col w-full max-w-7xl mx-auto gap-4 h-full p-4">
      <DashboardBar />
    
      <UploadFile />
      <Dashboard/>
    </section>
  );
};

export default Page;
