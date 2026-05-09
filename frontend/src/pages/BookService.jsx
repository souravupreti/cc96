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
      <div className="min-h-[calc(100vh-80px)] bg-app-bg flex items-center justify-center px-4 fade-in">
        <div className="bg-white rounded-premium shadow-premium p-12 max-w-md w-full text-center border border-gray-100">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">✅</div>
          <h2 className="text-3xl font-extrabold text-app-text mb-2">Booking Success!</h2>
          <p className="text-gray-500 font-medium">Redirecting you to your bookings dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-app-bg flex items-center justify-center px-4 py-12 fade-in">
      <div className="bg-white rounded-premium shadow-[0_20px_60px_rgba(108,59,245,0.08)] max-w-xl w-full border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-[#9B6BFF] p-8 text-center text-white relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Complete Your Booking</h2>
            <p className="text-white/80 text-sm">Professional service at your doorstep</p>
          </div>
        </div>

        <div className="p-8">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm font-medium flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>}

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block mb-2 font-bold text-app-text text-sm ml-1">Service Type</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-bold text-app-text text-sm ml-1">Preferred Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all cursor-pointer"
                />
              </div>

              <div>
                <label className="block mb-2 font-bold text-app-text text-sm ml-1">Preferred Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all cursor-pointer"
                />
              </div>
            </div>

            {selectedService && (
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">
                    {selectedService.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Selected Plan</p>
                    <p className="text-app-text font-bold text-lg">{selectedService.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-black text-2xl">₹{selectedService.basePrice}</p>
                  <p className="text-gray-400 text-xs font-medium">Inc. all taxes</p>
                </div>
              </div>
            )}

            <label className="block mb-2 font-bold text-app-text text-sm ml-1">Service Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House No, Street, Landmark, City..."
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl mb-8 focus:outline-none focus:border-primary focus:bg-white transition-all resize-none h-32"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white py-4 rounded-btn font-bold hover:bg-secondary-hover shadow-[0_8px_20px_rgba(255,107,53,0.25)] hover:shadow-[0_8px_25px_rgba(255,107,53,0.35)] disabled:opacity-50 transition-all duration-300 text-lg hover:-translate-y-1"
            >
              {loading ? 'Processing...' : 'Confirm & Book Now'}
            </button>
            <p className="text-center text-gray-400 text-xs font-medium mt-4">
              By confirming, you agree to our terms and conditions.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
