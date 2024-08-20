'use client'

import { FaArrowUp, FaFile } from "react-icons/fa6";

const NewPrompt = () => {
  return (
   <>
   <div className="p-[50px]"></div>
    <div className="w-full input max-w-4xl h-12 bg-neutral absolute bottom-4 self-center flex items-center justify-between p-2">
    <div>
    <button className="bg-gray-400/60 w-8 h-8 rounded-full flex items-center justify-center">
    <label htmlFor="file">
       <FaFile />
     </label>
    <input id="file" type="file" multiple={false} hidden accept=".pdf"/>
    </button>
    </div>
     <input className="w-full h-10" />
     <button className="btn w-10 h-full">
       <FaArrowUp size={40} />
     </button>
   </div>
   </>
  )
}

export default NewPrompt