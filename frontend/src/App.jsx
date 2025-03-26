import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'; // Import NavBar
import Home from './pages/Home'; // Path to your Home component
import Footer from './components/Footer'; // Import Footer


function App() {
  
  return ( 
  
    <div>
       <NavBar /> {/* Add NavBar here */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home route */}
        
      </Routes>
      <Footer /> {/* Add Footer here */}
    </div>
  );
}

export default App;
