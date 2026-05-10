import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import { BookOpen, RefreshCw, Calendar, ChevronRight } from 'lucide-react';

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
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  }, [auth.userId]);

  useEffect(() => {
    if (auth.loading) return;

    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [auth.isAuthenticated, auth.loading, navigate, fetchBookings]);

  const filteredBookings = activeTab === 'All'
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await api.patch(`/api/bookings/${bookingId}/cancel`);
      setBookings(bookings.map(b => b._id === bookingId ? res.data.booking : b));
    } catch (err) {
      setError(err.response?.data?.error || 'Error cancelling booking');
    }
  };

  if (auth.loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw size={48} color="var(--purple)" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px' }}>
                <BookOpen size={32} color="white" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 'inherit' }}>My Bookings</h1>
                <p style={{ opacity: 0.8, margin: 0 }}>Manage and track your service requests</p>
              </div>
            </div>
            <button 
              onClick={() => { setLoading(true); fetchBookings(); }} 
              className="btn-premium" 
              style={{ background: 'white', color: 'var(--purple)', padding: '10px 24px', minWidth: 'auto' }}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        <div className="tabs" style={{ marginBottom: '40px' }}>
          {['All', 'Pending', 'Accepted', 'Delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ color: '#E65100', background: '#FFF3E0', padding: '16px', borderRadius: '12px', marginBottom: '32px', fontWeight: '500', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <RefreshCw size={48} color="var(--purple)" className="animate-spin" />
            <p style={{ marginTop: '16px', color: 'var(--gray)', fontWeight: '600' }}>Updating your list...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card-3d" style={{ textAlign: 'center', padding: '100px 40px' }}>
            <div className="icon-box" style={{ width: '100px', height: '100px', fontSize: '40px' }}>
              <Calendar size={48} color="var(--purple)" />
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>No {activeTab === 'All' ? '' : activeTab.toLowerCase()} bookings</h3>
            <p style={{ color: 'var(--gray)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
              You don't have any bookings in this category. Browse our premium services to find what you need.
            </p>
            {activeTab === 'All' && (
              <button onClick={() => navigate('/services')} className="btn-premium btn-premium-orange">
                Browse Services <ChevronRight size={20} />
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={() => handleCancel(booking._id)}
                isVendor={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
