import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import { 
  LayoutDashboard, RefreshCw, ClipboardList, Clock, 
  CheckCircle, CheckCircle2, ChevronRight, AlertCircle 
} from 'lucide-react';

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
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  }, [auth.userId]);

  useEffect(() => {
    if (auth.loading) return;

    if (!auth.isAuthenticated || auth.userType !== 'vendor') {
      navigate('/vendor-login');
      return;
    }

    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [auth.isAuthenticated, auth.userType, auth.loading, navigate, fetchBookings]);

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

  const handleDecline = async (bookingId) => {
    try {
      const res = await api.patch(`/api/bookings/${bookingId}/decline`);
      setBookings(bookings.map(b => b._id === bookingId ? res.data.booking : b));
    } catch (err) {
      setError(err.response?.data?.error || 'Error declining booking');
    }
  };

  const filteredBookings = bookings.filter(b => b.status === activeTab);
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    completed: bookings.filter(b => b.status === 'Delivered').length
  };

  if (auth.loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw size={48} color="#0D9488" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #0D9488, #0F766E)' }}>
        <div className="container">
          <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px' }}>
                <LayoutDashboard size={32} color="white" />
              </div>
              <div>
                <h1 style={{ margin: 0 }}>Vendor Dashboard</h1>
                <p style={{ opacity: 0.8, margin: 0 }}>Monitor and manage your service requests</p>
              </div>
            </div>
            <button 
              onClick={() => { setLoading(true); fetchBookings(); }} 
              className="btn-premium" 
              style={{ background: 'white', color: '#0D9488', padding: '10px 24px', minWidth: 'auto' }}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
          <div className="card-3d stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
            <div className="icon-box" style={{ margin: 0, background: '#F0F0F0', flexShrink: 0 }}><ClipboardList color="#444" /></div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--dark)' }}>{stats.total}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--gray)', textTransform: 'uppercase' }}>Total</div>
            </div>
          </div>
          <div className="card-3d stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
            <div className="icon-box icon-box-orange" style={{ margin: 0, flexShrink: 0 }}><Clock color="var(--orange)" /></div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--orange)' }}>{stats.pending}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--gray)', textTransform: 'uppercase' }}>New</div>
            </div>
          </div>
          <div className="card-3d stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
            <div className="icon-box icon-box-green" style={{ margin: 0, flexShrink: 0 }}><CheckCircle2 color="#2E7D32" /></div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#2E7D32' }}>{stats.completed}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--gray)', textTransform: 'uppercase' }}>Done</div>
            </div>
          </div>
        </div>

        <div className="tabs" style={{ marginBottom: '40px' }}>
          {['Pending', 'Accepted', 'Delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              style={activeTab === tab ? { background: '#0D9488' } : {}}
            >
              {tab === 'Pending' ? 'New Requests' : tab === 'Accepted' ? 'In Progress' : 'Completed'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ color: '#E65100', background: '#FFF3E0', padding: '16px', borderRadius: '12px', marginBottom: '32px', fontWeight: '500', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <RefreshCw size={48} color="#0D9488" className="animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="card-3d" style={{ textAlign: 'center', padding: '100px 40px' }}>
            <div className="icon-box icon-box-green" style={{ width: '80px', height: '80px' }}>
              <CheckCircle size={40} color="#2E7D32" />
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>All Caught Up!</h3>
            <p style={{ color: 'var(--gray)' }}>No {activeTab.toLowerCase()} bookings found in this category.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onAccept={() => handleAccept(booking._id)}
                onDeliver={() => handleDeliver(booking._id)}
                onDecline={() => handleDecline(booking._id)}
                isVendor={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
