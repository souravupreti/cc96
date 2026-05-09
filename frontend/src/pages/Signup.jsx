import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import OTPInput from '../components/OTPInput';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

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

  const stepLabels = ['Mobile', 'Verify', 'Details'];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-app-bg flex items-center justify-center px-4 py-12 fade-in">
      <div className="bg-white rounded-premium shadow-[0_20px_60px_rgba(108,59,245,0.08)] max-w-md w-full border border-gray-100 overflow-hidden">
        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-primary to-[#9B6BFF] p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Create Account</h2>
            <p className="text-white/80 text-sm">Join the best home service platform</p>
          </div>
        </div>

        <div className="p-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                  step > i + 1 ? 'bg-[#10b981] text-white' :
                  step === i + 1 ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                {i < 2 && <div className={`w-10 h-1 rounded-full ${step > i + 1 ? 'bg-[#10b981]' : 'bg-gray-100'}`} />}
              </div>
            ))}
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm font-medium flex items-center gap-2 fade-in">
            <span>⚠️</span> {error}
          </div>}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="fade-in">
              <label className="block mb-2 font-bold text-app-text text-sm ml-1">Mobile Number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit number"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl mb-6 focus:outline-none focus:border-primary focus:bg-white transition-all text-lg"
                maxLength="10"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-4 rounded-btn font-bold hover:bg-secondary-hover shadow-[0_8px_20px_rgba(255,107,53,0.25)] hover:shadow-[0_8px_25px_rgba(255,107,53,0.35)] disabled:opacity-50 transition-all duration-300 text-lg hover:-translate-y-0.5"
              >
                {loading ? 'Sending...' : 'Get OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="fade-in">
              <label className="block mb-6 font-bold text-app-text text-sm text-center">
                Enter OTP sent to <span className="text-primary">+91 {mobile}</span>
              </label>
              <OTPInput onChange={setOtp} />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-4 rounded-btn font-bold hover:bg-secondary-hover shadow-[0_8px_20px_rgba(255,107,53,0.25)] hover:shadow-[0_8px_25px_rgba(255,107,53,0.35)] disabled:opacity-50 transition-all duration-300 text-lg hover:-translate-y-0.5"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-gray-400 font-medium text-sm mt-6 hover:text-primary transition-colors">
                ← Change number
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleRegister} className="fade-in">
              <label className="block mb-2 font-bold text-app-text text-sm ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl mb-5 focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
              <label className="block mb-2 font-bold text-app-text text-sm ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl mb-8 focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-4 rounded-btn font-bold hover:bg-secondary-hover shadow-[0_8px_20px_rgba(255,107,53,0.25)] hover:shadow-[0_8px_25px_rgba(255,107,53,0.35)] disabled:opacity-50 transition-all duration-300 text-lg hover:-translate-y-0.5"
              >
                {loading ? 'Creating...' : 'Complete Signup'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium">
              Already have an account? <Link to="/login" className="text-primary font-bold hover:text-primary-hover">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
