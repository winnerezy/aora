import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

const Signin = () => {
  return (
    <div className='flex w-full h-full items-center justify-center'>
        <SignIn path='/sign-up' signUpUrl='/sign-up' forceRedirectUrl='/dashboard' appearance={{baseTheme: dark}}/>
    </div>
  )
}

export default Signin