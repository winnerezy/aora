import { SignUp } from '@clerk/clerk-react'

export const SignUpPage = () => {
  return (
    <div className='flex w-full h-full items-center justify-center'>
        <SignUp path='/sign-up' signInUrl='/sign-in' forceRedirectUrl='/dashboard'/>
    </div>
  )
}
