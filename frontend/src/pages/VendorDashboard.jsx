import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';

export default function VendorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get(`/api/bookings/vendor/${auth.userId}`);
      setBookings(res.data.bookings || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  }, [auth.userId]);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.userType !== 'vendor') {
      navigate('/vendor-login');
      return;
    }

    fetchBookings();

    // Polling every 30 seconds
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [auth.isAuthenticated, auth.userType, navigate, fetchBookings]);

  const handleAccept = async (bookingId) => {
    try {
      const res = await api.patch(`/api/bookings/${bookingId}/accept`);
      setBookings(bookings.map(b => b._id === bookingId ? res.data.booking : b));
    } catch (err) {
      setError(err.response?.data?.error || 'Error accepting booking');
    }
  };

  const handleDeliver = async (bookingId) => {
    try {
      const res = await api.patch(`/api/bookings/${bookingId}/deliver`);
      setBookings(bookings.map(b => b._id === bookingId ? res.data.booking : b));
    } catch (err) {
      setError(err.response?.data?.error || 'Error marking delivered');
    }
  };

  const getPendingBookings = () => bookings.filter(b => b.status === 'Pending');
  const getAcceptedBookings = () => bookings.filter(b => b.status === 'Accepted');
  const getDeliveredBookings = () => bookings.filter(b => b.status === 'Delivered');

  const tabs = [
    { key: 'pending', label: 'Pending', count: getPendingBookings().length, color: 'yellow' },
    { key: 'accepted', label: 'Accepted', count: getAcceptedBookings().length, color: 'blue' },
    { key: 'delivered', label: 'Delivered', count: getDeliveredBookings().length, color: 'green' }
  ];

  const renderBookings = () => {
    let data = [];
    if (activeTab === 'pending') data = getPendingBookings();
    else if (activeTab === 'accepted') data = getAcceptedBookings();
    else data = getDeliveredBookings();

    return data.length === 0 ? (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📦</div>
        <p className="text-gray-500 text-lg">No bookings in this category</p>
      </div>
    ) : (
      <div className="grid gap-4">
        {data.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onAccept={() => handleAccept(booking._id)}
            onDeliver={() => handleDeliver(booking._id)}
            isVendor={true}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Auto-refreshes every 30 seconds</p>
          </div>
          <button
            onClick={() => { setLoading(true); fetchBookings(); }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            ↻ Refresh
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4 border border-red-200">{error}</div>}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading bookings...</div>
        ) : (
          renderBookings()
        )}
      </div>
    </div>
  );
}
