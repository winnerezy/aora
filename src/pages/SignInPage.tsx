import { SignIn } from '@clerk/clerk-react'

export const SignInPage = () => {
  return (
    <div className='flex w-full h-full items-center justify-center'>
      <SignIn path='/sign-in' signUpUrl='/sign-up' forceRedirectUrl='/dashboard'/>
    </div>
  )
}
