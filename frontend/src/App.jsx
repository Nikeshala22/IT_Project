import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SparePartsPage from './pages/SparePartsPage.jsx'
import AddToCartPage from './pages/AddToCartPage.jsx'
import ShoppingCart from './pages/ShoppingCart.jsx'
import SparePartsPageAdmin from './pages/SparePartsPageAdmin.jsx'
import Checkout from './pages/Checkout.jsx'
import OrdersPageAdmin from './pages/OrdersPageAdmin.jsx'
import AdminSidebar from './pages/AdminSidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import { useState, useEffect } from 'react'
import './App.css'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check localStorage for admin status
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  return (
    <Router>
      <div className="App">
        {isAdmin && <AdminSidebar />}
        <div className={`main-content ${isAdmin ? 'with-sidebar' : ''}`} style={{ backgroundColor: '#586573' }}>
          <Routes>
            <Route path="/" element={<SparePartsPage />} />
            <Route path="/addtocart/:id" element={<AddToCartPage />} />
            <Route path="/shoppingcart" element={<ShoppingCart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute>
                  <OrdersPageAdmin />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/admin/parts"
              element={
                <ProtectedRoute>
                  <SparePartsPageAdmin />
                </ProtectedRoute> 
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
