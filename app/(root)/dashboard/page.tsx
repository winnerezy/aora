import { UploadFile } from "@/components/UploadFile";
import Dashboard from "@/components/Dashboard";
import { DashboardBar } from "@/components/DashboardBar";

const page = () => {
  return (
    <section className="flex flex-col w-full max-w-7xl mx-auto gap-4 h-full py-2 px-2">
      <DashboardBar />
      <UploadFile />
      <Dashboard />
    </section>
  );
};

export default page;
