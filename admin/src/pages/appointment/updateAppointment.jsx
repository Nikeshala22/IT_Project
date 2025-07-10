import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/adminPackagesContext/appContex';

function AppointmentUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAllAppointments } = useAppContext(); // Use context to refresh appointments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    AID: '',
    Aname: '',
    Aphone: '',
    AregID: '',
    Avtype: '',
    AvnumLetters: '',
    AvnumNumbers: '',
    service: [],
    comment: '',
    date: '',
    time: '',
  });
  const [phoneInput, setPhoneInput] = useState('');
  const [errors, setErrors] = useState({});
  const [existingAppointments, setExistingAppointments] = useState([]);

  const vehicleTypes = [
    'Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Ford',
    'Hyundai', 'Kia', 'Nissan', 'Porsche', 'Tesla', 'Chevrolet', 'Mazda',
    'Subaru', 'Lexus', 'Jaguar', 'Land Rover', 'Volvo', 'Mitsubishi', 'Other'
  ];

  const timeSlots = [
    '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM', '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM'
  ];

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/appointment/get-all-appointments');
      const result = await response.json();
      if (response.ok) {
        setExistingAppointments(result.appointments || []);
      } else {
        console.error('Failed to fetch appointments:', result.message);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/appointment/view-appointment/${id}`);
        const result = await response.json();

        if (response.ok) {
          const [letters, numbers] = result.Avnum.split(' ');
          setFormData({
            AID: result.AID || '',
            Aname: result.Aname || '',
            Aphone: result.Aphone || '',
            AregID: result.AregID || '',
            Avtype: result.Avtype || '',
            AvnumLetters: letters || '',
            AvnumNumbers: numbers || '',
            service: result.service || [],
            comment: result.comment || '',
            date: result.date || '',
            time: result.time || '',
          });
          setPhoneInput(result.Aphone ? result.Aphone.slice(3) : '');
          setLoading(false);
        } else {
          setError(result.message || 'Failed to fetch appointment');
          setLoading(false);
        }
      } catch (err) {
        setError('Error fetching appointment: ' + err.message);
        setLoading(false);
      }
    };

    fetchAppointment();
    fetchAppointments();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prevData) => {
        const updatedServices = checked
          ? [...prevData.service, value]
          : prevData.service.filter((service) => service !== value);
        return { ...prevData, service: updatedServices };
      });
    } else if (name === 'Aphone') {
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 9);
      setPhoneInput(numericValue);
      validatePhoneNumber(numericValue);
      setFormData((prevData) => ({
        ...prevData,
        Aphone: numericValue ? `+94${numericValue}` : ''
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      if (name === 'Aname') validateName(value);
      if (name === 'AvnumLetters' || name === 'AvnumNumbers') {
        validateVehicleNumber(
          name === 'AvnumLetters' ? value : formData.AvnumLetters,
          name === 'AvnumNumbers' ? value : formData.AvnumNumbers
        );
      }
      if (name === 'date' || name === 'time') {
        validateTimeSlot(
          name === 'date' ? value : formData.date,
          name === 'time' ? value : formData.time
        );
      }
      if (name === 'date') validateDate(value);
    }
  };

  const handleNameKeyPress = (e) => {
    const charCode = e.charCode;
    if (!(charCode === 32 || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122))) {
      e.preventDefault();
    }
  };

  const handleLettersKeyPress = (e) => {
    const charCode = e.charCode;
    if (charCode === 32 || (charCode < 65 || charCode > 90)) {
      e.preventDefault();
    }
  };

  const handleNumbersKeyPress = (e) => {
    const charCode = e.charCode;
    if (charCode === 32 || (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  };

  const validateName = (name) => {
    if (name && !/^[A-Za-z\s]+$/.test(name)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Aname: 'Full name must contain only letters and spaces',
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, Aname: '' }));
    }
  };
//validation part
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{9}$/;
    const firstDigit = phone.slice(0, 1);
    const secondDigit = phone.slice(1, 2);
    const validSecondDigits = ['0', '1', '2', '4', '5', '6', '7', '8'];

    if (phone.length >= 2 && (firstDigit !== '7' || !validSecondDigits.includes(secondDigit))) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Aphone: 'Invalid phone number',
      }));
    } else if (phone.length > 0 && phone.length < 9) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Aphone: '',
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, Aphone: '' }));
    }
  };

  const validateVehicleNumber = (letters, numbers) => {
    let vehicleNumberErrors = {};

    if (letters.length > 0 && (letters.length < 2 || letters.length > 3)) {
      vehicleNumberErrors.AvnumLetters = 'Vehicle number must start with 2 or 3 uppercase letters (e.g., AB or ABC)';
    } else if (letters.length > 0 && !/^[A-Z]+$/.test(letters)) {
      vehicleNumberErrors.AvnumLetters = 'Vehicle number must start with uppercase letters only (e.g., AB or ABC)';
    } else {
      vehicleNumberErrors.AvnumLetters = '';
    }

    if (numbers.length > 0 && (numbers.length !== 4 || !/^\d{4}$/.test(numbers))) {
      vehicleNumberErrors.AvnumNumbers = 'Vehicle number must end with exactly 4 digits (e.g., 1234)';
    } else {
      vehicleNumberErrors.AvnumNumbers = '';
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...vehicleNumberErrors,
    }));
  };

  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (selectedDate < tomorrow) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        date: 'You cannot select today or a past date. Please select a date starting from tomorrow.',
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, date: '' }));
    }
  };

  const validateTimeSlot = (date, time) => {
    if (!date || !time) return false;

    const bookingsForSlot = existingAppointments.filter(
      (appointment) => appointment.date === date && appointment.time === time && appointment._id !== id
    );

    if (bookingsForSlot.length >= 2) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        time: 'This time slot is already booked by 2 users. Please select a different time.',
      }));
      return false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, time: '' }));
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

    if (!formData.Aname) {
      formErrors.Aname = 'Full name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.Aname)) {
      formErrors.Aname = 'Full name must contain only letters and spaces';
    }

    const phoneRegex = /^\d{9}$/;
    const firstDigit = phoneInput.slice(0, 1);
    const secondDigit = phoneInput.slice(1, 2);
    const validSecondDigits = ['0', '1', '2', '4', '5', '6', '7', '8'];

    if (firstDigit !== '7' || !validSecondDigits.includes(secondDigit)) {
      formErrors.Aphone = 'Invalid phone number';
    } else if (!phoneRegex.test(phoneInput)) {
      formErrors.Aphone = 'Phone number must be exactly 9 digits (e.g., 769400272)';
    }

    const letters = formData.AvnumLetters;
    const numbers = formData.AvnumNumbers;

    if (letters.length < 2 || letters.length > 3) {
      formErrors.AvnumLetters = 'Vehicle number must start with 2 or 3 uppercase letters (e.g., AB or ABC)';
    } else if (!/^[A-Z]+$/.test(letters)) {
      formErrors.AvnumLetters = 'Vehicle number must start with uppercase letters only (e.g., AB or ABC)';
    }

    if (numbers.length !== 4 || !/^\d{4}$/.test(numbers)) {
      formErrors.AvnumNumbers = 'Vehicle number must end with exactly 4 digits (e.g., 1234)';
    }

    if (!formData.Avtype) {
      formErrors.Avtype = 'Please select a vehicle type';
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (selectedDate < tomorrow) {
      formErrors.date = 'You cannot select today or a past date. Please select a date starting from tomorrow.';
    }

    if (!formData.time) {
      formErrors.time = 'Please select a time slot';
    } else if (!validateTimeSlot(formData.date, formData.time)) {
      formErrors.time = 'This time slot is already booked by 2 users. Please select a different time.';
    }

    if (formData.service.length === 0) {
      formErrors.service = 'Please select at least one service';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const fullVehicleNumber = `${formData.AvnumLetters} ${formData.AvnumNumbers}`;
    const submissionData = {
      ...formData,
      Avnum: fullVehicleNumber,
    };

    try {
      const response = await fetch(`http://localhost:4000/api/appointment/update-appointment/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        await getAllAppointments(); // Refresh appointments in context
        alert('Appointment updated successfully!');
        navigate('/appointments');
      } else {
        alert(`Failed to update appointment: ${result.message || 'Please try again.'}`);
      }
    } catch (err) {
      console.error('Update Error:', err);
      if (err.message.includes('Failed to fetch')) {
        alert('Error updating appointment: CORS issue or server not responding. Please check the backend CORS configuration.');
      } else {
        alert(`Error updating appointment: ${err.message}`);
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p>Loading...</p></div>;
  if (error) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
              Update <span className="text-[#034396]">Appointment</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500">Modify your car service appointment</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="AID"
              value={formData.AID}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 shadow-sm cursor-not-allowed"
              readOnly
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="Aname"
              value={formData.Aname}
              onChange={handleChange}
              onKeyPress={handleNameKeyPress}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-[#006AFF] transition-all duration-300 ease-in-out placeholder-gray-400 text-gray-800 shadow-sm ${
                errors.Aname ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              required
            />
            {errors.Aname && (
              <p className="mt-1 text-sm text-red-500">{errors.Aname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <div className="flex items-center border border-gray-300 rounded-l-lg px-3 py-3 bg-gray-50">
                <span className="text-gray-600">🇱🇰 +94</span>
              </div>
              <input
                type="tel"
                name="Aphone"
                value={phoneInput}
                onChange={handleChange}
                maxLength={9}
                pattern="[0-9]{9}"
                className={`w-full px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-[#006AFF] focus:border-[#006AFF] transition-all duration-300 ease-in-out placeholder-gray-400 text-gray-800 shadow-sm ${
                  errors.Aphone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Phone Number"
                required
              />
            </div>
            {errors.Aphone && (
              <p className="mt-1 text-sm text-red-500">{errors.Aphone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="AregID"
              value={formData.AregID}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-[#006AFF] transition-all duration-300 ease-in-out placeholder-gray-400 text-gray-800 shadow-sm"
              placeholder="Enter Registration ID"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select
                name="Avtype"
                value={formData.Avtype}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-[#006AFF] transition-all duration-300 ease-in-out text-gray-800 shadow-sm max-h-40 overflow-y-auto ${
                  errors.Avtype ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select a vehicle type</option>
                {vehicleTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.Avtype && (
                <p className="mt-1 text-sm text-red-500">{errors.Avtype}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="AvnumLetters"
                  value={formData.AvnumLetters}
                  onChange={handleChange}
                  onKeyPress={handleLettersKeyPress}
                  maxLength={3}
                  className={`w-1/3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-[#006AFF] transition-all duration-300 ease-in-out placeholder-gray-400 text-gray-800 shadow-sm ${
                    errors.AvnumLetters ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="AB or ABC"
                  required
                />
                <span className="text-gray-600">-</span>
                <input
                  type="text"
                  name="AvnumNumbers"
                  value={formData.AvnumNumbers}
                  onChange={handleChange}
                  onKeyPress={handleNumbersKeyPress}
                  maxLength={4}
                  className={`w-2/3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-[#006AFF] transition-all duration-300 ease-in-out placeholder-gray-400 text-gray-800 shadow-sm ${
                    errors.AvnumNumbers ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1234"
                  required
                />
              </div>
              <div className="flex space-x-2">
                {errors.AvnumLetters && (
                  <p className="mt-1 text-sm text-red-500 flex-1">{errors.AvnumLetters}</p>
                )}
                {errors.AvnumNumbers && (
                  <p className="mt-1 text-sm text-red-500 flex-1">{errors.AvnumNumbers}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={getTomorrowDate()}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-[#006AFF] transition-all duration-300 ease-in-out placeholder-gray-400 text-gray-800 shadow-sm ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Slot <span className="text-red-500">*</span>
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-[#006AFF] transition-all duration-300 ease-in-out text-gray-800 shadow-sm ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="mt-1 text-sm text-red-500">{errors.time}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Services <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
              {[
                "Wash and Grooming", "Under carriage Degreasing", "Hybrid Services",
                "Lube Services", "Windscreen Treatments", "Wheel Alignment",
                "Exterior & Interior Detailing", "Inspection Reports", "Battery Services",
                "Mechanical Detailing", "Body Shop"
              ].map((service, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    name="service"
                    value={service}
                    checked={formData.service.includes(service)}
                    onChange={handleChange}
                    className="h-5 w-5 text-[#006AFF] border-gray-300 rounded focus:ring-[#006AFF] transition-all duration-300"
                  />
                  <label className="ml-2 text-sm text-gray-700">{service}</label>
                </div>
              ))}
            </div>
            {errors.service && (
              <p className="mt-1 text-sm text-red-500">{errors.service}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-[#006AFF] transition-all duration-300 ease-in-out placeholder-gray-400 text-gray-800 shadow-sm"
              placeholder="Any additional comments or requests"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#03326f] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#0052CC] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Update Appointment
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/appointments"
            className="text-[#03326F] font-medium hover:underline transition-all duration-300"
          >
            Back to Appointments
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AppointmentUpdate;