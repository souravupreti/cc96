import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

    // Polling every 30 seconds
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [auth.isAuthenticated, navigate, fetchBookings]);

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const acceptedCount = bookings.filter(b => b.status === 'Accepted').length;
  const deliveredCount = bookings.filter(b => b.status === 'Delivered').length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 text-sm mt-1">Auto-refreshes every 30 seconds</p>
          </div>
          <button
            onClick={() => { setLoading(true); fetchBookings(); }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Status Summary */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-700">{pendingCount}</div>
              <div className="text-yellow-600 text-sm font-medium">Pending</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{acceptedCount}</div>
              <div className="text-blue-600 text-sm font-medium">Accepted</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{deliveredCount}</div>
              <div className="text-green-600 text-sm font-medium">Delivered</div>
            </div>
          </div>
        )}

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4 border border-red-200">{error}</div>}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">No bookings yet</p>
            <button
              onClick={() => navigate('/services')}
              className="mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Book a Service
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
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
