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
        </div>
    )
}

export default NavBar