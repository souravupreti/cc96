import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get(`/api/bookings/customer/${auth.userId}`);
      setBookings(res.data.bookings || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  }, [auth.userId]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [auth.isAuthenticated, navigate, fetchBookings]);

  const filteredBookings = activeTab === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === activeTab);

  const tabs = ['All', 'Pending', 'Accepted', 'Delivered'];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-app-bg py-12 px-4 fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-app-text flex items-center gap-3">
              <span className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center">📋</span>
              My Bookings
            </h1>
            <p className="text-gray-500 text-sm mt-2 ml-15">Auto-refreshes every 30 seconds</p>
          </div>
          <button
            onClick={() => { setLoading(true); fetchBookings(); }}
            className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-bold hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
          >
            <span>↻</span> Refresh
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium">⚠️ {error}</div>}

        {/* Filter Tabs */}
        {bookings.length > 0 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                {tab}
                <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${activeTab === tab ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {tab === 'All' ? bookings.length : bookings.filter(b => b.status === tab).length}
                </span>
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-premium border border-gray-100 p-12 text-center shadow-sm fade-in">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
              📭
            </div>
            <h3 className="text-2xl font-bold text-app-text mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {activeTab === 'All' 
                ? "You haven't booked any services yet. Find a professional for your home today!"
                : `You don't have any ${activeTab.toLowerCase()} bookings at the moment.`}
            </p>
            {activeTab === 'All' && (
              <button
                onClick={() => navigate('/services')}
                className="bg-secondary text-white px-8 py-3.5 rounded-btn font-bold hover:bg-secondary-hover shadow-lg transition-all hover:-translate-y-1"
              >
                Browse Services
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 fade-in">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isVendor={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
