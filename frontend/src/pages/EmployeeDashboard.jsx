import React, { useEffect } from 'react' 
import { useAuth } from '../context/authContext' 
import { Outlet,useNavigate } from 'react-router-dom'
import Sidebar from '../components/EmployeeDashboard/Sidebar'
import Navbar from '../components/dashboard/Navbar'

const EmployeeDashboard = () => {
    
    const { user, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login')
        }
    }, [user, loading, navigate]) 

    return (
        <div className='flex'>
           <Sidebar/>

           <div className="flex-1 ml-64 bg-gray-light h-screen">
                <Navbar/>
                <Outlet/>
            </div>
        </div>
    )
}
export default EmployeeDashboard