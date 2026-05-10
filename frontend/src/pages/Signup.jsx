import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import OTPInput from '../components/OTPInput';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Phone, Lock, User, MessageSquare, ChevronRight, ArrowLeft } from 'lucide-react';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(mobile)) {
      setError('Mobile must be 10 digits');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/customer/send-otp', { mobile });
      setStep(2);
      setTimer(30);
    } catch (err) {
      setError(err.response?.data?.error || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/customer/verify-otp', { mobile, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !password) {
      setError('All fields required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/customer/register', { mobile, name, password });
      auth.login(res.data.token, res.data.customerId, mobile, '', 'customer');
      navigate('/services');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ paddingTop: '80px' }}>
      <div className="auth-card">
        <div className="auth-header">
          {step === 2 ? <MessageSquare size={48} color="white" style={{ marginBottom: '12px' }} /> : <UserPlus size={48} color="white" style={{ marginBottom: '12px' }} />}
          <h2>{step === 2 ? 'Verify OTP' : 'Join ServiceHub'}</h2>
          <p>{step === 2 ? `Enter code sent to +91 ${mobile}` : 'Professional services at your fingertips'}</p>
        </div>

        <div className="auth-body">
          {error && (
            <div style={{ color: '#E65100', background: '#FFF3E0', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Mobile Number</label>
                <div className="input-group">
                  <Phone size={20} className="icon" />
                  <input
                    type="text"
                    className="input-field"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter 10-digit mobile"
                    maxLength="10"
                  />
                </div>
              </div>
              <button type="submit" className="btn-premium btn-premium-orange" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                {loading ? 'Sending...' : 'Get OTP'} <ChevronRight size={20} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <OTPInput onChange={setOtp} />
              <button type="submit" className="btn-premium btn-premium-orange" disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
                {loading ? 'Verifying...' : 'Verify OTP'} <ChevronRight size={20} />
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {timer > 0 ? (
                  <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Resend OTP in <span style={{ fontWeight: '700', color: 'var(--purple)' }}>{timer}s</span></p>
                ) : (
                  <button type="button" onClick={handleSendOtp} style={{ background: 'none', border: 'none', color: 'var(--purple)', fontWeight: '700', cursor: 'pointer' }}>Resend OTP</button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ width: '100%', background: 'none', border: 'none', color: 'var(--gray)', marginTop: '16px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <ArrowLeft size={16} /> Change Mobile Number
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-group">
                  <User size={20} className="icon" />
                  <input
                    type="text"
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Create Password</label>
                <div className="input-group">
                  <Lock size={20} className="icon" />
                  <input
                    type="password"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>
              <button type="submit" className="btn-premium btn-premium-orange" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'} <ChevronRight size={20} />
              </button>
            </form>
          )}

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
            <p style={{ color: 'var(--gray)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--purple)', fontWeight: '700', textDecoration: 'none' }}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
