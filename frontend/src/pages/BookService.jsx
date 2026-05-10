import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, MapPin, CheckCircle, ChevronRight, Briefcase } from 'lucide-react';

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
    if (auth.loading) return;

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
  }, [auth.isAuthenticated, auth.loading, navigate, location.state]);

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

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
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card-3d" style={{ maxWidth: '400px', textAlign: 'center', padding: '60px 40px' }}>
          <div className="icon-box icon-box-green" style={{ width: '80px', height: '80px' }}>
            <CheckCircle size={40} color="#2E7D32" />
          </div>
          <h2 style={{ marginBottom: '10px' }}>Booking Success!</h2>
          <p style={{ color: 'var(--gray)' }}>Redirecting you to your bookings dashboard...</p>
        </div>
      </div>
    );
  }
  if (auth.loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw size={48} color="var(--purple)" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="auth-wrapper" style={{ minHeight: 'calc(100vh - 72px)', background: 'var(--light-bg)' }}>
      <div className="auth-card auth-card-booking" style={{ maxWidth: '560px' }}>
        <div className="auth-header">
          <Calendar size={48} color="white" style={{ marginBottom: '12px' }} />
          <h2>Book a Service</h2>
          <p>Professional home maintenance at your doorstep</p>
        </div>

        <div className="auth-body">
          {error && (
            <div style={{ color: '#E65100', background: '#FFF3E0', padding: '16px', borderRadius: '12px', marginBottom: '32px', fontWeight: '500', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Service Type</label>
              <div className="input-group">
                <Briefcase size={20} className="icon" />
                <select
                  className="input-field"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name} (₹{service.basePrice})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="date-time-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="form-group">
                <label>Preferred Date</label>
                <div className="input-group">
                  <Calendar size={20} className="icon" />
                  <input
                    type="date"
                    className="input-field"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={getMinDate()}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Preferred Time</label>
                <div className="input-group">
                  <Clock size={20} className="icon" />
                  <input
                    type="time"
                    className="input-field"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Service Address</label>
              <div className="input-group">
                <MapPin size={20} className="icon" style={{ top: '24px' }} />
                <textarea
                  className="input-field"
                  style={{ height: '120px', resize: 'none', paddingTop: '14px' }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full address where service is required..."
                />
              </div>
            </div>

            <button type="submit" className="btn-premium btn-premium-orange" disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
              {loading ? 'Processing...' : 'Confirm Booking'} <ChevronRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
