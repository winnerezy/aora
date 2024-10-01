import Topbar from "@/components/Topbar";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
   <section className="min-h-screen flex flex-col items-center w-full">
     <Topbar />
      <div className="flex flex-col items-center px-4 mt-12">
        <div className="text-center self-center mt-14 flex flex-col gap-2 items-center max-w-5xl w-full">
          <h3 className="hero1 md:text-7xl font-bold gradient">Aora</h3>
          <p className="hero2 font-semibold">
            Make Your Experience Better and Easier
          </p>
          <p className="hero3 font-light">Discover new things</p>
          <Link
            href={"/sign-in"}
            className={buttonVariants({
              className: "text-white w-36 rounded-full h-12 bg",
            })}
          >
            Start Now
          </Link>
        </div>
      </div>
   </section>
  );
};

export default page;
