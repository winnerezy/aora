import { SignUp } from "@clerk/nextjs"

const Signup = () => {
  return (
    <div className='flex w-full h-full items-center justify-center'>
        <SignUp path='/sign-up' signInUrl='/sign-in' forceRedirectUrl='/dashboard'/>
    </div>
  )
}

export default Signup