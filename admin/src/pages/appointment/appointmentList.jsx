import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AppointmentList({ totalAppointments }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/api/appointment/get-all-appointments');
      const result = await response.json();

      console.log('API Response:', result);

      if (response.ok) {
        const appointmentData = result.appointments || result || [];
        setAppointments(appointmentData);
        setFilteredAppointments(appointmentData);
        setLoading(false);
      } else {
        setError(result.message || 'Failed to fetch appointments');
        setLoading(false);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Error fetching appointments: ' + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter((appointment) =>
        appointment.Aname.toLowerCase().startsWith(query)
      );
      setFilteredAppointments(filtered);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/appointment/delete-appointment/${appointmentId}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.ok) {
        alert('Appointment deleted successfully!');
        setAppointments(appointments.filter((appointment) => appointment._id !== appointmentId));
        setFilteredAppointments(filteredAppointments.filter((appointment) => appointment._id !== appointmentId));
      } else {
        alert(`Failed to delete appointment: ${result.message || 'Please try again.'}`);
      }
    } catch (err) {
      alert(`Error deleting appointment: ${err.message}`);
    }
  };

  const handleUpdate = (appointmentId) => {
    navigate(`/appointment-update/${appointmentId}`);
  };

  const handleApprove = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/appointment/approve-appointment/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: true }),
      });
      const result = await response.json();

      if (response.ok) {
        alert('Appointment approved successfully!');
        const updatedAppointments = appointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, approved: true } : appointment
        );
        setAppointments(updatedAppointments);
        setFilteredAppointments(updatedAppointments);
      } else {
        alert(`Failed to approve appointment: ${result.message || 'Please try again.'}`);
      }
    } catch (err) {
      alert(`Error approving appointment: ${err.message}`);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(3, 50, 111);
    doc.text('Appointment List', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 14, 30);

    const tableColumns = [
      'Appointment ID',
      'Name',
      'Phone',
      'Vehicle',
      'Date',
      'Time',
      'Services',
      'Status'
    ];
    const tableRows = filteredAppointments.map(appointment => [
      appointment.AID,
      appointment.Aname,
      appointment.Aphone,
      `${appointment.Avtype} (${appointment.Avnum})`,
      appointment.date,
      appointment.time,
      appointment.service.join(', '),
      appointment.approved ? 'Approved' : 'Pending'
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: [3, 50, 111], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 30 },
        7: { cellWidth: 20 },
      },
      margin: { top: 40 },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
    }

    doc.save('appointment_list.pdf');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={fetchAppointments}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Appointment <span className="text-blue-600">List</span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">View and manage your scheduled appointments (Total: {totalAppointments})</p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/appointment-form"
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-all duration-300"
            >
              Add New Appointment
            </Link>
            <button
              onClick={downloadPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-all duration-300"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 shadow-sm"
          />
        </div>

        {filteredAppointments.length === 0 ? (
          <p className="text-gray-600 text-center">
            {searchQuery ? 'No appointments match your search.' : 'No appointments found.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Appointment ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Phone</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Vehicle</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Services</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">{appointment.AID}</td>
                    <td className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">{appointment.Aname}</td>
                    <td className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">{appointment.Aphone}</td>
                    <td className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">
                      {appointment.Avtype} ({appointment.Avnum})
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">{appointment.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">{appointment.time}</td>
                    <td className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">
                      {appointment.service.join(', ')}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">
                      {appointment.approved ? 'Approved' : 'Pending'}
                    </td>
                    <td className="px-4 py-2 text-sm border-b border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdate(appointment._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-all duration-300"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700 transition-all duration-300"
                        >
                          Delete
                        </button>
                        {!appointment.approved && (
                          <button
                            onClick={() => handleApprove(appointment._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-700 transition-all duration-300"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <Link
            to="/"
            className="text-blue-600 font-medium hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AppointmentList;