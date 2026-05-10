
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VendorLogin from './pages/VendorLogin';
import ServiceBrowse from './pages/ServiceBrowse';
import BookService from './pages/BookService';
import MyBookings from './pages/MyBookings';
import VendorDashboard from './pages/VendorDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/services" element={<ServiceBrowse />} />
          <Route path="/booking" element={<BookService />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
