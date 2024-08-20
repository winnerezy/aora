import React from 'react'

export const Chat = () => {
  return (
    <div className='relative w-full h-screen flex flex-col items-center justify-center'>
     <p className='text-3xl font-semibold'> Chat With Your PDF</p>
     <input className='input w-full max-w-4xl bg-white absolute bottom-8 text-black h-10 rounded-lg'/>
    </div>
  )
}
