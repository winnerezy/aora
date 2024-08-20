import { TypeAnimation } from "react-type-animation"
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {

  const navigate = useNavigate()
  return (
    <section className="relative flex items-center h-full">
      <div className="flex flex-col md:flex-row h-full gap-2">
      <div className="flex flex-col gap-6 h-full flex-1 items-center justify-center text-center">
        <h1 className="text-[70px] md:text-[130px] font-bold bg-gradient-to-tl from-secondary via-neutral-content to-primary text-transparent bg-clip-text">
          Aora
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-wide w-[100%] md:w-[70%]">
          Read, Discuss, Discover: The AI-Powered PDF Companion
        </h2>
        <h3 className="w-[100%] md:w-[70%]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint
          consequuntur sit commodi optio iusto vero, fuga beatae saepe, impedit
          excepturi veniam distinctio sapiente dolores delectus assumenda quae
          id eius quod?
        </h3>
        <button onClick={() => navigate("/sign-in")} className="btn w-36 bg-primary hover:bg-primary/80 text-white rounded-xl">
          Get Started
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        {/* <Boxes className="relative w-full h-screen"/> */}
         <div className="w-[80%] h-[50%]">
         <img src="/src/assets/ai.jpg" alt="AI" className="w-[100%] h-[100%] rounded-lg object-contain"/>
         </div>
        <div className="text-white rounded-lg absolute bottom-24 right-0 p-2 flex items-center bg-secondary-content">
          <TypeAnimation
            sequence={[
              
              "Unlock your PDF potential",
              1000, 
              "Summarize effiently",
              1000,
              "Generate practive questions",
              1000
            ]}
            wrapper="span"
            speed={50}
            style={{ fontSize: "1rem", display: "inline-block" }}
            repeat={Infinity}
          />
        </div>
      </div>
      </div>
      <div className="absolute bottom-4 flex gap-2 left-[50%] -translate-x-[50%]">
        <Link to="/">Terms of Service</Link>
        <span>|</span>
        <Link to="/">Private Policy</Link>
      </div>
    </section>
  );
};
