import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { UserCircle, Phone, Lock, ChevronRight } from 'lucide-react';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mobile || !password) {
      setError('Mobile and password required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/customer/login', { mobile, password });
      auth.login(res.data.token, res.data.customerId, mobile, '', 'customer');
      navigate('/services');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ background: 'var(--light-bg)', paddingTop: '80px' }}>
      <div className="auth-card" style={{ boxShadow: '0 20px 60px rgba(108,59,245,0.15)' }}>
        <div className="auth-header">
          <UserCircle size={48} color="white" style={{ marginBottom: '12px' }} />
          <h2>Welcome Back</h2>
          <p>Customer Login</p>
        </div>

        <div className="auth-body">
          {error && (
            <div style={{ color: '#E65100', background: '#FFF3E0', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mobile Number</label>
              <div className="input-group">
                <Phone size={20} className="icon" />
                <input
                  type="text"
                  className="input-field"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  maxLength="10"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <Lock size={20} className="icon" />
                <input
                  type="password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button type="submit" className="btn-premium btn-premium-orange" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login Now'} <ChevronRight size={20} />
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
            <p style={{ color: 'var(--gray)' }}>
              Don't have an account? <Link to="/signup" style={{ color: 'var(--purple)', fontWeight: '700', textDecoration: 'none' }}>Sign Up</Link>
            </p>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #EEE' }}>
              <Link to="/vendor-login" style={{ color: 'var(--gray)', textDecoration: 'none', fontSize: '13px' }}>Are you a Vendor? <span style={{ color: 'var(--purple)', fontWeight: '600' }}>Login here</span></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
