import { createContext, useState, useContext } from 'react';

// Create the context
const AppContext = createContext();

// Provider component
export const AppContextProvider = ({ children }) => {
  // Authentication State
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState({});
  const [backendurl] = useState('http://localhost:4000'); // Default backend URL
  const [error, setError] = useState(null);

  // Appointment State
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Appointment Functions
  const getAllAppointments = async (start = '', end = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendurl}/api/appointment/get-all-appointments?start=${start}&end=${end}`);
      const result = await response.json();
      if (response.ok) {
        setAppointments(result.appointments || []);
      } else {
        throw new Error(result.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTotalAppointments = async () => {
    return appointments.length;
  };

  const getPendingAppointments = async () => {
    return appointments.filter((a) => !a.approved && !a.deleted).length;
  };

  const getApprovedAppointments = async () => {
    return appointments.filter((a) => a.approved && !a.deleted).length;
  };

  const getDeletedAppointments = async () => {
    return appointments.filter((a) => a.deleted).length;
  };

  const deleteAppointment = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendurl}/api/appointment/delete-appointment/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAppointments(appointments.filter((a) => a._id !== id));
        return true;
      } else {
        throw new Error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const approveAppointment = async (appointmentId) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendurl}/api/appointment/approve-appointment/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      });
      if (response.ok) {
        const updatedAppointments = appointments.map((a) =>
          a._id === appointmentId ? { ...a, approved: true } : a
        );
        setAppointments(updatedAppointments);
        return true;
      } else {
        throw new Error('Failed to approve appointment');
      }
    } catch (error) {
      console.error('Error approving appointment:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login Function
  const login = async (email, password) => {
    const maxRetries = 3;
    let attempt = 1;

    while (attempt <= maxRetries) {
      try {
        const response = await fetch(`${backendurl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          const role = data.user.role;
          const validRoles = ['inventoryadmin', 'appointmentadmin', 'orderadmin', 'jobsadmin', 'user'];

          if (!validRoles.includes(role)) {
            throw new Error('Invalid user role');
          }

          setIsLoggedin(true);
          setUserData(data.user);

          // Fetch appointments for appointmentadmin
          if (role === 'appointmentadmin') {
            await getAllAppointments();
          }

          return { success: true, message: 'Logged in successfully!' };
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } catch (error) {
        console.error(`Attempt ${attempt} - Error:`, error);
        if (error.message === 'Invalid user role' || attempt === maxRetries) {
          setError(error.message);
          return { success: false, message: error.message };
        }
        if (attempt < maxRetries) {
          attempt++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        setError('Network error or max retries exceeded');
        return { success: false, message: 'Network error or max retries exceeded' };
      }
    }
  };

  // Common Functionality: Logout
  const logout = () => {
    setIsLoggedin(false);
    setUserData({});
    setAppointments([]);
    setError(null);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        backendurl,
        appointments,
        setAppointments,
        deleteAppointment,
        getTotalAppointments,
        getPendingAppointments,
        getApprovedAppointments,
        getDeletedAppointments,
        getAllAppointments,
        loading,
        error,
        logout,
        login,
        approveAppointment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export default AppContext;