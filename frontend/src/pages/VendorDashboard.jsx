import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';

export default function VendorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
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
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [auth.isAuthenticated, auth.userType, navigate, fetchBookings]);

  const handleAccept = async (bookingId) => {
    try {
      const res = await api.patch(`/api/bookings/${bookingId}/accept`);
      setBookings(bookings.map(b => b._id === bookingId ? res.data.booking : b));
      setActiveTab('Accepted');
    } catch (err) {
      setError(err.response?.data?.error || 'Error accepting booking');
    }
  };

  const handleDeliver = async (bookingId) => {
    try {
      const res = await api.patch(`/api/bookings/${bookingId}/deliver`);
      setBookings(bookings.map(b => b._id === bookingId ? res.data.booking : b));
      setActiveTab('Delivered');
    } catch (err) {
      setError(err.response?.data?.error || 'Error marking delivered');
    }
  };

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const acceptedCount = bookings.filter(b => b.status === 'Accepted').length;
  const deliveredCount = bookings.filter(b => b.status === 'Delivered').length;

  const tabs = [
    { id: 'Pending', label: 'New Requests', count: pendingCount, color: 'bg-orange-500' },
    { id: 'Accepted', label: 'In Progress', count: acceptedCount, color: 'bg-blue-500' },
    { id: 'Delivered', label: 'Completed', count: deliveredCount, color: 'bg-green-500' }
  ];

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-app-bg py-12 px-4 fade-in">
      <div className="max-w-5xl mx-auto">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#059669] to-[#34d399] rounded-[24px] p-8 md:p-10 mb-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-white/80 font-medium mb-1">Welcome back,</p>
              <h1 className="text-3xl md:text-4xl font-extrabold">Test Vendor</h1>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center min-w-[120px]">
                <div className="text-3xl font-black mb-1">{bookings.length}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-white/80">Total</div>
              </div>
              <div className="bg-white text-[#059669] rounded-2xl p-4 text-center min-w-[120px] shadow-sm">
                <div className="text-3xl font-black mb-1">{pendingCount}</div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-80">Pending</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-app-text">Manage Bookings</h2>
          <button
            onClick={() => { setLoading(true); fetchBookings(); }}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold hover:bg-gray-50 transition-all text-sm flex items-center gap-2 shadow-sm"
          >
            <span>↻</span> Refresh
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium">⚠️ {error}</div>}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-full shadow-sm border border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                activeTab === tab.id ? tab.color : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-premium border border-gray-100 p-16 text-center shadow-sm fade-in">
            <div className="text-6xl mb-4">☕</div>
            <h3 className="text-2xl font-bold text-app-text mb-2">All caught up!</h3>
            <p className="text-gray-500">No {tab.label.toLowerCase()} bookings at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 fade-in">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onAccept={() => handleAccept(booking._id)}
                onDeliver={() => handleDeliver(booking._id)}
                isVendor={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
