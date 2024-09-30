import Topbar from "@/components/Topbar";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <>
      <Topbar />
      <div className="flex flex-col items-center px-4">
        <div className="text-center self-center mt-14 flex flex-col gap-2 items-center max-w-5xl w-full">
          <h3 className="hero1 md:text-7xl font-bold gradient">Aura</h3>
          <p className="hero2 font-semibold text-nowrap">
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
    </>
  );
};

export default page;
