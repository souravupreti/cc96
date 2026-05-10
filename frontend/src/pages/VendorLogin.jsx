import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Mail, Lock, ChevronRight, ArrowLeft } from 'lucide-react';

export default function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/vendor/login', { email, password });
      auth.login(res.data.token, res.data.vendorId, '', email, 'vendor');
      navigate('/vendor-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ background: '#F0F9F9', paddingTop: '80px' }}>
      <div className="auth-card" style={{ boxShadow: '0 20px 60px rgba(13,148,136,0.15)' }}>
        <div className="auth-header" style={{ background: 'linear-gradient(135deg, #0D9488, #0F766E)' }}>
          <Briefcase size={48} color="white" style={{ marginBottom: '12px' }} />
          <h2>Vendor Portal</h2>
          <p>Manage your professional services</p>
        </div>

        <div className="auth-body">
          {error && (
            <div style={{ color: '#E65100', background: '#FFF3E0', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Business Email</label>
              <div className="input-group">
                <Mail size={20} className="icon" />
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vendor@example.com"
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

            <button type="submit" className="btn-premium" style={{ width: '100%', marginTop: '10px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', boxShadow: '0 4px 20px rgba(13,148,136,0.35)' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login to Dashboard'} <ChevronRight size={20} />
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
            <p style={{ color: 'var(--gray)', fontStyle: 'italic', marginBottom: '16px' }}>
              Note: Credentials provided by ServiceHub admin
            </p>
            <Link to="/login" style={{ color: '#0D9488', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <ArrowLeft size={16} /> Back to Customer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}