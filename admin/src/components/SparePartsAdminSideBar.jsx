import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const SideBar = () => {
    return (
        <div className='min-h-screen bg-white border-r'>
            <ul className='text-[#515151] mt-5'>
                <NavLink to={'/'} className={({isActive}) => 
                    `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                        isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                    }`}>
                    <img src={assets.home_icon} alt="Dashboard" />
                    <p>Dashboard</p>
                </NavLink>

                <NavLink to={'/all-spare-parts'} className={({isActive}) => 
                    `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                        isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                    }`}>
                    <img src={assets.list_icon} alt="All Parts" />
                    <p>All Spare Parts</p>
                </NavLink>

                <NavLink to={'/add-spare-part'} className={({isActive}) => 
                    `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                        isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                    }`}>
                    <img src={assets.add_icon} alt="Add Part" />
                    <p>Add Spare Part</p>
                </NavLink>
            </ul>
        </div>
    )
}

export default SideBar