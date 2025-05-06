import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import AppContext from '../../context/appContex';
import AppointmentList from './appointmentList';

const AppointmentDashboard = () => {
  const {
    appointments,
    setAppointments,
    deleteAppointment,
    getAllAppointments,
    getTotalAppointments,
    getPendingAppointments,
    getCompletedAppointments,
    getCanceledAppointments,
  } = useContext(AppContext);
  const [stats, setStats] = useState({
    totalAppointments: 5,
    pendingAppointments: 2,
    approvedAppointments: 3,
    deletedAppointments: 1,
  });
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleExportPDF = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/appointments/export-pdf?start=${dateRange.start}&end=${dateRange.end}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        }
      });

      if (!response.ok) {
        throw new Error('PDF export failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `appointments-report-${dateRange.start || 'all'}-${dateRange.end || 'all'}.pdf`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await getAllAppointments(dateRange.start, dateRange.end);

        // Filter appointments based on date range
        let filteredAppointments = appointments;
        if (dateRange.start && dateRange.end) {
          filteredAppointments = appointments.filter((a) => {
            const appointmentDate = new Date(a.date);
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            return appointmentDate >= startDate && appointmentDate <= endDate;
          });
        }

        setStats({
          totalAppointments: filteredAppointments.length,
          pendingAppointments: filteredAppointments.filter((a) => !a.approved && !a.deleted).length,
          approvedAppointments: filteredAppointments.filter((a) => a.approved && !a.deleted).length,
          deletedAppointments: filteredAppointments.filter((a) => a.deleted).length,
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [appointments, dateRange, getAllAppointments]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const scrollToList = () => {
    if (document.getElementById('appointment-list-section')) {
      document.getElementById('appointment-list-section').scrollIntoView({ behavior: 'smooth' });
      setShowList(true);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white shadow-md p-4 mb-6 rounded-lg flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard - Appointments</h1>
        </div>
        <div className="space-x-4">
          <span className="text-sm text-gray-600">Last Updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Filter by Date Range</h3>
        <div className="flex space-x-4">
          <input
            type="date"
            name="start"
            value={dateRange.start}
            onChange={handleDateChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="date"
            name="end"
            value={dateRange.end}
            onChange={handleDateChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => setDateRange({ start: '', end: '' })}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Appointments</p>
              <p className="text-2xl font-bold text-blue-600">6</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Appointments</p>
              <p className="text-2xl font-bold text-yellow-600">2</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Approved Appointments</p>
              <p className="text-2xl font-bold text-green-600">4</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Deleted Appointments</p>
              <p className="text-2xl font-bold text-red-600">1</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11l2-2m0 0l2 2m-2-2v6m-6-6h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Appointment Actions</h2>
        <div className="space-x-4">
          <Link
            to="/appointments"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span>View Full List</span>
          </Link>
        
        </div>
      </div>

      {showList && (
        <div id="appointment-list-section" className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Detailed Appointment List (Total: {stats.totalAppointments})</h2>
          <AppointmentList totalAppointments={stats.totalAppointments} appointments={appointments} setAppointments={setAppointments} />
        </div>
      )}
    </div>
  );
};

export default AppointmentDashboard;