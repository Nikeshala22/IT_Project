import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'; // Import NavBar
import Home from './pages/Home'; // Path to your Home component
import Footer from './components/Footer'; // Import Footer
import SpareParts from './pages/spareParts/SpareParts';



function App() {
  
  return ( 
  
    <div>
       <NavBar /> {/* Add NavBar here */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home route */}
        <Route path="/spareparts" element={<SpareParts />} /> {/* SpareParts route */}
        {/* <Route path="/services" element={<services />} />  */}
      </Routes>
      <Footer /> {/* Add Footer here */}
    </div>
  );
}

export default App;
