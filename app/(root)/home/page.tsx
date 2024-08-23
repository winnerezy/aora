// import { TypeAnimation } from "react-type-animation"
import Link from "next/link"
import { BiStar } from "react-icons/bi";
export default function Page() {

  return (
    <section className="relative flex flex-col items-center justify-center text-center gap-6 self-center w-full h-full">
      <section className="flex flex-col md:flex-row">
        <div className="flex flex-col gap-8 items-center justify-center text-center flex-1">
          <h1 className="text-[120px] md:text-[160px] font-bold bg-gradient-to-tl from-secondary via-neutral-content to-primary text-transparent bg-clip-text">
            Aora
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-wide w-[80%] md:w-[70%]">
            Read, Discuss, Discover: The AI-Powered PDF Companion
          </h2>
          <h3 className="w-[80%] md:w-[70%]">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint
            consequuntur sit commodi optio iusto vero, fuga beatae saepe, impedit
            excepturi veniam distinctio sapiente dolores delectus assumenda quae
            id eius quod?
          </h3>
          <Link href="/dashboard" className="btn w-36 bg-primary hover:bg-primary/80 text-white rounded-xl">
            Get Started
          </Link>

        </div>

        {/* <Boxes className="relative w-full h-screen"/> */}
        {/* <div className="text-white rounded-lg absolute bottom-24 right-0 p-2 flex items-center bg-secondary-content">
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
        </div> */}

        <div className="flex flex-1 flex-shrink-0 items-center justify-center">
          <BiStar className="text-white size-[300px]" />
        </div>
      </section>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center mt-8 gap-8">
        <div className="card card-compact bg-base-100 w-96 shadow-xl">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
        <div className="card card-compact bg-base-100 w-96 shadow-xl">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
        <div className="card card-compact bg-base-100 w-96 shadow-xl">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      </div> */}
      <div className="absolute bottom-4 flex gap-2 left-[50%] -translate-x-[50%]">
        <Link href="/">Terms of Service</Link>
        <span>|</span>
        <Link href="/">Private Policy</Link>
      </div>
    </section>
  );
};

