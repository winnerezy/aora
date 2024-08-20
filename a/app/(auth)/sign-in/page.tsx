import { SignIn } from "@clerk/nextjs"


const Signin = () => {
  return (
    <div className='flex w-full h-full items-center justify-center'>
        <SignIn path='/sign-up' signUpUrl='/sign-up' forceRedirectUrl='/dashboard'/>
    </div>
  )
}

export default Signin