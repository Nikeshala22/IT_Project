import React from 'react'
import { ToastContainer } from 'react-toastify'
import { Routes, Route } from 'react-router-dom'
import NavBar from './Components/NavBar'
import SideBar from './Components/SideBar'
import AddSparePart from './pages/spareParts/AddSparePart'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='bg-[#F8F9FD] min-h-screen'>
      <ToastContainer />
      <NavBar />
      <div className='flex items-start'>
        <SideBar />
        <main className='flex-1 p-8'>
          <Routes>
            {/* Inventory Routes */}
            {/* <Route path='/' element={<Dashboard />} /> */}
            {/* <Route path='/inventory-dashboard' element={<Dashboard />} />
            <Route path='/all-spare-parts' element={<AllSpareParts />} /> */}
            <Route path='/add-spare-part' element={<AddSparePart />} />

            {/* Additional Routes */}
            {/* <Route path='/packages' element={<div>Packages Management</div>} />
            <Route path='/users' element={<div>User Management</div>} /> */}
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App