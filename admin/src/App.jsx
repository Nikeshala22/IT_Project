import React, { Component } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from './context/appContex';
import SideBar from './components/SideBar';
import AppointmentUpdate from './pages/appointment/updateAppointment';
import AppointmentList from './pages/appointment/appointmentList';
import AppointmentDashboard from './pages/appointment/appointmentDashBoard';
import Login from './pages/Login';
import NavBar from './components/Navbar';



// Error Boundary Class Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
            <p className="mt-2 text-gray-600">Error: {this.state.error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Placeholder components for other dashboards
const InventoryDashboard = () => <div>Inventory Dashboard</div>;
const OrderDashboard = () => <div>Order Dashboard</div>;
const JobsDashboard = () => <div>Jobs Dashboard</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const UserDashboard = () => <div>User Dashboard</div>;
const NotFound = () => <div className="min-h-screen flex items-center justify-center">Page Not Found</div>;
const Unauthorized = () => <div className="min-h-screen flex items-center justify-center">Unauthorized Access</div>;

// Layout component for admin routes with NavBar and SideBar
const AdminLayout = () => {
  const { isLoggedin, userData } = useAppContext();

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Protected route for appointmentadmin-only routes
const AppointmentAdminRoute = () => {
  const { isLoggedin, userData } = useAppContext();

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  if (userData.role !== 'appointmentadmin') {
    return <Unauthorized />;
  }

  return <Outlet />;
};

// Root redirect based on login status and role
const RootRedirect = () => {
  const { isLoggedin, userData } = useAppContext();

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  switch (userData.role) {
    case 'inventoryadmin':
      return <Navigate to="/inventory-dashboard" replace />;
    case 'appointmentadmin':
      return <Navigate to="/appointment-dashboard" replace />;
    case 'orderadmin':
      return <Navigate to="/order-dashboard" replace />;
    case 'jobsadmin':
      return <Navigate to="/jobs-dashboard" replace />;
    case 'user':
      return <Navigate to="/user" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Root Route */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/user/*" element={<UserDashboard />} />

        {/* Admin Layout with NavBar and SideBar */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
          <Route path="/order-dashboard" element={<OrderDashboard />} />
          <Route path="/jobs-dashboard" element={<JobsDashboard />} />

          {/* AppointmentAdmin-only Routes */}
          <Route element={<AppointmentAdminRoute />}>
            <Route path="/appointment-dashboard" element={<AppointmentDashboard />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/appointment-update/:id" element={<AppointmentUpdate />} />
          </Route>
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;