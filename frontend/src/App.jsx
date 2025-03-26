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
import OrderReviewPage from './pages/OrderReviewPage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx'
import PaymentsPageAdmin from './pages/PaymentsPageAdmin.jsx'
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
        <div 
          className={`main-content ${isAdmin ? 'with-sidebar' : ''}`} 
          style={{ 
            backgroundColor: '#586573',
            marginLeft: isAdmin ? '16rem' : '0', // Add margin equal to sidebar width (64px = 16rem)
            transition: 'margin-left 0.3s',
            minHeight: '100vh',
            width: isAdmin ? 'calc(100% - 16rem)' : '100%' // Adjust width
          }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SparePartsPage />} />
            <Route path="/addtocart/:id" element={<AddToCartPage />} />
            <Route path="/shoppingcart" element={<ShoppingCart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-review" element={<OrderReviewPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
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
            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute>
                  <PaymentsPageAdmin />
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
