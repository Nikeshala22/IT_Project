import React, { useContext } from "react";
import { Routes, Route } from 'react-router-dom';
import SparePartsDashboard from "./pages/dashBoard/sparePartsDashBoard";
import AddSpareParts from "./pages/spareParts/addSpareParts";
import UpdateSpareParts from "./pages/spareParts/updateSpareParts";
import DeleteSpareParts from "./pages/spareParts/DeleteSpareParts";
import SideNavBar from "./components/Navbar";
import { SparePartsContext } from "./context/adminSparePartsContext/sparePartsContext.jsx";


const App = () => {

  // Use context to access the state
  const { aToken } = useContext(SparePartsContext);
 
  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <SideNavBar/>
      <div className='flex items-start'>
        <SideBar/> 
        <Routes>
           {/*--------Admin Route-------- */}
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<SparePartsDashboard/>}/>
          <Route path='/all-appointments' element={<AddSpareParts/>}/>
          <Route path='/add-spareparts' element={<AddSpareParts/>}/>
          <Route path='/update-spareparts' element={<UpdateSpareParts/>}/>
          <Route path='/delete-spareparts' element={<DeleteSpareParts/>}/>
        </Routes>
      </div>
    </div>
  ) : (
    <>  
      <Login/>
      <ToastContainer/>
    </>
  );
};

export default App
