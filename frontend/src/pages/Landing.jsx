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
        setServices([
          { _id: '1', name: 'Deep Cleaning', description: 'Intensive home cleaning', basePrice: 999, icon: '✨', color: 'bg-blue-100' },
          { _id: '2', name: 'Plumbing', description: 'Expert repairs & fixes', basePrice: 499, icon: '🔧', color: 'bg-orange-100' },
          { _id: '3', name: 'Electrician', description: 'Wiring & appliance setup', basePrice: 399, icon: '⚡', color: 'bg-yellow-100' },
          { _id: '4', name: 'AC Service', description: 'Cooling & maintenance', basePrice: 799, icon: '❄️', color: 'bg-cyan-100' },
          { _id: '5', name: 'Pest Control', description: 'Complete pest management', basePrice: 899, icon: '🛡️', color: 'bg-green-100' }
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

  const getServiceColor = (index) => {
    const colors = ['bg-blue-50 text-blue-600', 'bg-orange-50 text-orange-600', 'bg-purple-50 text-purple-600', 'bg-green-50 text-green-600', 'bg-pink-50 text-pink-600'];
    return colors[index % colors.length];
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-app-bg pt-12 pb-24 md:pt-20 md:pb-32 px-4">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 text-sm font-semibold text-primary mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              #1 Home Service Platform
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-app-text leading-[1.1] mb-6 tracking-tight">
              Your Home, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#9B6BFF]">Perfectly Maintained</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Book expert professionals for cleaning, repair, and maintenance. Trusted, verified, and delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/services" className="px-8 py-4 rounded-btn font-bold text-white bg-secondary hover:bg-secondary-hover shadow-[0_8px_24px_rgba(255,107,53,0.3)] transition-all duration-300 text-lg hover:-translate-y-1">
                Book a Service
              </Link>
              <a href="#how-it-works" className="px-8 py-4 rounded-btn font-bold text-gray-700 bg-white hover:bg-gray-50 shadow-sm border border-gray-100 transition-all duration-300 text-lg flex items-center justify-center gap-2">
                <span>▶</span> Watch How it Works
              </a>
            </div>
          </div>

          {/* Right Floating Mockup */}
          <div className="relative hidden md:block animate-float">
            <div className="absolute top-10 -left-12 bg-white p-4 rounded-premium shadow-premium z-20 flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">⭐</div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Customer Rating</p>
                <p className="font-extrabold text-lg text-app-text">4.9/5.0</p>
              </div>
            </div>
            <div className="absolute bottom-20 -right-8 bg-white p-4 rounded-premium shadow-premium z-20 flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">✓</div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Services Done</p>
                <p className="font-extrabold text-lg text-app-text">50,000+</p>
              </div>
            </div>
            
            {/* Phone Mockup CSS representation */}
            <div className="w-[320px] h-[640px] bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-900 mx-auto relative overflow-hidden flex flex-col">
              <div className="absolute top-0 w-full h-6 bg-gray-900 rounded-b-3xl z-30 flex justify-center">
                <div className="w-20 h-4 bg-black rounded-b-xl"></div>
              </div>
              <div className="bg-primary pt-12 pb-6 px-6 text-white rounded-b-3xl">
                <p className="opacity-80 text-sm">Location</p>
                <p className="font-bold flex items-center gap-1">New Delhi <span className="text-xs">▼</span></p>
              </div>
              <div className="flex-1 bg-gray-50 p-4">
                <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-orange-50 h-24 rounded-xl"></div>
                  <div className="bg-blue-50 h-24 rounded-xl"></div>
                  <div className="bg-purple-50 h-24 rounded-xl"></div>
                  <div className="bg-green-50 h-24 rounded-xl"></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="flex gap-3">
                     <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                     <div className="flex-1">
                       <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                       <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 -mt-10 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-premium shadow-premium p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
          <div className="text-center px-4">
            <div className="text-4xl font-extrabold text-primary mb-1">10K+</div>
            <div className="text-gray-500 font-medium">Happy Customers</div>
          </div>
          <div className="text-center px-4">
            <div className="text-4xl font-extrabold text-primary mb-1">500+</div>
            <div className="text-gray-500 font-medium">Verified Vendors</div>
          </div>
          <div className="text-center px-4">
            <div className="text-4xl font-extrabold text-primary mb-1">50K+</div>
            <div className="text-gray-500 font-medium">Services Delivered</div>
          </div>
          <div className="text-center px-4">
            <div className="text-4xl font-extrabold text-primary mb-1">4.8★</div>
            <div className="text-gray-500 font-medium">Average Rating</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-app-bg">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-app-text mb-4">How it works</h2>
            <div className="w-20 h-1.5 bg-secondary rounded-full"></div>
            <p className="text-gray-500 text-lg mt-6 max-w-xl">Get your home services sorted in three simple, hassle-free steps.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Dotted Line connecting cards (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-gray-300 z-0"></div>

            {[
              { step: '1', icon: '🔍', title: 'Choose a Service', desc: 'Browse through our extensive list of verified home services.' },
              { step: '2', icon: '📅', title: 'Pick a Time', desc: 'Select a convenient date and time for the professional to arrive.' },
              { step: '3', icon: '✨', title: 'Relax & Enjoy', desc: 'Our expert gets the job done while you sit back and relax.' }
            ].map((item, i) => (
              <div key={item.step} className="bg-white p-8 rounded-premium shadow-sm border border-gray-100 relative z-10 hover:-translate-y-2 hover:shadow-premium transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-[#9B6BFF] rounded-full flex items-center justify-center text-white font-bold text-xl absolute -top-6 shadow-lg group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div className="text-5xl mb-6 mt-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-app-text mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-app-text mb-4">Popular Services</h2>
              <div className="w-20 h-1.5 bg-secondary rounded-full"></div>
            </div>
            <Link to="/services" className="text-primary font-semibold hover:text-primary-hover flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.slice(0, 5).map((service, index) => {
              const colorClass = getServiceColor(index);
              return (
                <div
                  key={service._id}
                  onClick={() => handleServiceClick(service)}
                  className="bg-white rounded-premium border border-gray-100 p-6 cursor-pointer hover:shadow-premium hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 group flex flex-col h-full"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300 ${colorClass}`}>
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-app-text mb-2">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-1">{service.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-extrabold text-app-text">₹{service.basePrice}</span>
                    <button className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 bg-secondary text-white px-4 py-2 rounded-full text-sm font-bold transition-all duration-300">
                      Book
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-primary py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Ready to upgrade your home?</h2>
          <p className="text-primary-100 text-lg mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust ServiceHub for their everyday home needs.
          </p>
          <Link
            to={auth.isAuthenticated ? '/services' : '/signup'}
            className="inline-block px-10 py-4 rounded-btn font-bold text-primary bg-white hover:bg-gray-50 shadow-xl transition-all duration-300 text-lg hover:-translate-y-1"
          >
            {auth.isAuthenticated ? 'Browse All Services' : 'Get Started Free'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-gray-400 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-extrabold text-white mb-4 flex items-center gap-2">
              <span className="text-primary">⚡</span> ServiceHub
            </div>
            <p className="text-sm max-w-sm leading-relaxed mb-6">
              The most trusted professional home services platform. Quality, reliability, and satisfaction delivered to your doorstep.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Twitter', 'Instagram'].map(social => (
                <div key={social} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-white">
                  {social[0]}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">All Services</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Customer Login</Link></li>
              <li><Link to="/vendor-login" className="hover:text-primary transition-colors">Vendor Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>support@servicehub.com</li>
              <li>1-800-SERVICE</li>
              <li>New Delhi, India</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 ServiceHub. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
