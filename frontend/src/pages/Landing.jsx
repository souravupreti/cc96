import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

export default function Landing() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/api/services');
        setServices(res.data.services || []);
      } catch {
        // Fallback to static data if API not available
        setServices([
          { _id: '1', name: 'Home Cleaning', description: 'Professional home cleaning service', basePrice: 500, icon: '🧹' },
          { _id: '2', name: 'Plumbing', description: 'Expert plumbing services', basePrice: 700, icon: '🔧' },
          { _id: '3', name: 'Electrician', description: 'Licensed electrician services', basePrice: 800, icon: '⚡' },
          { _id: '4', name: 'Painting', description: 'Professional painting services', basePrice: 1000, icon: '🎨' },
          { _id: '5', name: 'Pest Control', description: 'Pest control and management', basePrice: 600, icon: '🦟' }
        ]);
      }
    };
    fetchServices();
  }, []);

  const handleServiceClick = (service) => {
    if (auth.isAuthenticated && auth.userType === 'customer') {
      navigate('/booking', { state: { serviceId: service._id } });
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 text-center">
          <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Trusted by 10,000+ customers
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Book Home Services<br />
            <span className="text-blue-200">in Minutes</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Find trusted professionals for home cleaning, plumbing, electrician, painting and more. Quality service at your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {auth.isAuthenticated && auth.userType === 'customer' ? (
              <Link
                to="/services"
                className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                Browse Services →
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Get Started Free →
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  Customer Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-blue-700">10K+</div>
            <div className="text-gray-500 text-sm mt-1">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-700">500+</div>
            <div className="text-gray-500 text-sm mt-1">Verified Vendors</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-700">50K+</div>
            <div className="text-gray-500 text-sm mt-1">Services Delivered</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-700">4.8★</div>
            <div className="text-gray-500 text-sm mt-1">Average Rating</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">How It Works</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Book a service in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: '01', icon: '🔍', title: 'Browse Services', desc: 'Explore various professional services available in your area' },
              { step: '02', icon: '📅', title: 'Book Instantly', desc: 'Select your preferred date, time, and provide service location' },
              { step: '03', icon: '✅', title: 'Get Service', desc: 'Verified professionals arrive at your doorstep on time' }
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
                <div className="absolute -top-4 -left-2 text-6xl font-black text-blue-100 group-hover:text-blue-200 transition-colors">{item.step}</div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">Popular Services</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Choose from our range of professional services</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                onClick={() => handleServiceClick(service)}
                className="group bg-white border border-gray-200 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                <h3 className="text-lg font-bold mb-1 text-gray-900">{service.name}</h3>
                <p className="text-gray-500 text-sm mb-3 leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-extrabold text-lg">₹{service.basePrice}</span>
                  <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">Book →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to book your first service?</h2>
          <p className="text-blue-200 text-lg mb-8">Join thousands of happy customers</p>
          <Link
            to={auth.isAuthenticated ? '/services' : '/signup'}
            className="inline-flex items-center bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl"
          >
            {auth.isAuthenticated ? 'Browse Services' : 'Create Free Account'} →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-4">ServiceHub</div>
          <p className="text-sm mb-6">Your trusted platform for home services</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/vendor-login" className="hover:text-white transition-colors">Vendor Portal</Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-xs text-gray-500">
            © 2026 ServiceHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
