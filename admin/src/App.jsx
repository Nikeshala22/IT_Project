import React from 'react'
import { ToastContainer } from 'react-toastify'
import { Routes, Route } from 'react-router-dom'
import NavBar from './Components/NavBar'
import SideBar from './components/SideBar'
import AddSparePart from './pages/spareParts/AddSparePart'
import 'react-toastify/dist/ReactToastify.css'
import DashBoard from './pages/spareParts/DashBoard'
import AllSpareParts from './pages/spareParts/AllSpareParts'
import UpdateSparePart from './pages/spareParts/UpdateSpareParts'

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
            
            <Route path='/' element={<DashBoard />} />
            <Route path='/all-spare-parts' element={<AllSpareParts />} />
            <Route path='/add-spare-part' element={<AddSparePart />} />
            <Route path='/update-spare-part/:id' element={<UpdateSparePart />} />

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