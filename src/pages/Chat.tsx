import { useEffect, useRef } from "react";
import NewPrompt from "../components/NewPrompt";

export const Chat = () => {

  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(()=> {
    endRef.current?.scrollIntoView({behavior: "smooth"})
  }, [])
  return (
    <section className="relative h-full flex items-center flex-col">
      <div className="flex w-full flex-1 overflow-scroll justify-center">
        <div className="w-[50%] flex flex-col gap-4">
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde
            voluptatibus a magni officiis ex accusamus similique omnis
            necessitatibus nemo! Tenetur, cumque aliquam quod quia ullam, optio
            recusandae quasi illum dolores nisi, magni voluptate fuga. Porro
            necessitatibus ducimus illo modi quod!
          </span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <span className="message">Test Messgae From Ai</span>
          <span className="message user">Test Messgae From User</span>
          <NewPrompt/>
          <div ref={endRef}></div>
        </div>
      </div>
    </section>
  );
};
