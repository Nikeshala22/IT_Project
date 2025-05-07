import React from 'react'
import { ToastContainer } from 'react-toastify'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/SparePartsAdminNavbar'
import SideBar from './components/SparePartsAdminSideBar'
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
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App