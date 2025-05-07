import React from 'react';
import { Routes, Route , Navigate , Outlet } from 'react-router-dom';
import NavBar from './components/NavBar'; // Import NavBar
import Home from './pages/Home'; // Path to your Home component
import Footer from './components/Footer'; // Import Footer
import SpareParts from './pages/spareParts/SpareParts';
import AppointmentForm from './pages/appointment/appointment';
import Packages from './pages/servicePackage/Package';
import AddToCartPage from './pages/order/AddToCartPage';
import Checkout from './pages/order/Checkout';
import OrderReviewPage from './pages/order/OrderReviewPage';
import ShoppingCart from './pages/order/ShoppingCart';
import PaymentPage from './pages/payment/PaymentPage';
import PaymentSuccessPage from './pages/payment/PaymentSuccessPage';
import Login from './pages/user/Login';
import { useAuth } from './context/authContext/authContext';
import MyProfile from './pages/user/MyProfile';

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { currentUser } = useAuth();
  return currentUser ? (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Public Route Wrapper (for login)
const PublicRoute = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" replace /> : <Outlet />;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/spareparts" element={<SpareParts />} />
        <Route path="/appointment-form" element={<AppointmentForm />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/add-to-cart/:id" element={<AddToCartPage />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-review" element={<OrderReviewPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/my-profile" element={<MyProfile />} />
      </Route>

      {/* Catch-all for undefined routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
