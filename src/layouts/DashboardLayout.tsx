import { useAuth } from '@clerk/clerk-react'
import { Sidebar } from '../components/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const DashboardLayout = () => {

    const { userId, isLoaded } = useAuth()

    const navigate = useNavigate()
    useEffect(()=> {
        if(isLoaded && !userId){
            navigate("/sign-in")
        }
    }, [isLoaded, userId, navigate])

    if(!isLoaded) return <p>Loading...</p>
  return (
    <div className='flex h-full'>
        <Sidebar/>
        <Outlet/>
    </div>
  )
}

export default DashboardLayout