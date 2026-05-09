import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function BookService() {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchServices = async () => {
      try {
        const res = await api.get('/api/services');
        setServices(res.data.services);
        if (location.state?.serviceId) {
          setServiceId(location.state.serviceId);
        }
      } catch (err) {
        setError('Error fetching services');
      }
    };

    fetchServices();
  }, [auth.isAuthenticated, navigate, location.state]);

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const selectedService = services.find(s => s._id === serviceId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!serviceId || !date || !time || !address) {
      setError('All fields required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/bookings', {
        serviceId,
        date,
        time,
        address
      });
      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center border border-gray-100">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        <h2 className="text-2xl font-extrabold mb-2 text-center text-gray-900">Book a Service</h2>
        <p className="text-gray-500 text-center text-sm mb-6">Fill in the details below</p>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4 border border-red-200 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Select Service</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-500 transition-colors bg-white"
          >
            <option value="">Choose a service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.icon} {service.name} - ₹{service.basePrice}
              </option>
            ))}
          </select>

          {selectedService && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-center">
              <span className="text-blue-700 font-bold text-lg">₹{selectedService.basePrice}</span>
              <span className="text-blue-600 text-sm ml-2">{selectedService.name}</span>
            </div>
          )}

          <label className="block mb-2 font-semibold text-gray-700 text-sm">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={getMinDate()}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-500 transition-colors"
          />

          <label className="block mb-2 font-semibold text-gray-700 text-sm">Select Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-500 transition-colors"
          />

          <label className="block mb-2 font-semibold text-gray-700 text-sm">Service Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your complete address"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            rows="3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 shadow-sm"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
