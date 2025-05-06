import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
    const navigate = useNavigate()

    return (
        <div className='flex items-center justify-between px-4 py-3 bg-white border-b sm:px-10'>
            <div className="flex items-center gap-2 text-xs">
                <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">Admin</p>
            </div>
            
            <div className="flex gap-4">
                <button 
                    onClick={() => navigate('/packages')}
                    className="px-4 py-2 text-sm rounded-full bg-gray-100 hover:bg-gray-200">
                    Packages
                </button>
                <button 
                    onClick={() => navigate('/users')}
                    className="px-4 py-2 text-sm rounded-full bg-gray-100 hover:bg-gray-200">
                    Users
                </button>
            </div>
        </div>
    )
}

export default NavBar