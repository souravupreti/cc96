import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ServiceCard from '../components/ServiceCard';

export default function ServiceBrowse() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/api/services');
        setServices(res.data.services);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (service, index) => {
    navigate('/booking', { state: { serviceId: service._id } });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-app-bg py-16 px-4 fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-app-text mb-4">All Services</h1>
          <div className="w-20 h-1.5 bg-secondary rounded-full mb-6"></div>
          <p className="text-gray-500 text-lg max-w-xl">Choose from our wide range of professional home services. Every service is delivered by verified experts.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium">⚠️ {error}</div>}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-premium border border-gray-100 p-20 text-center shadow-sm">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-app-text mb-2">No services found</h3>
            <p className="text-gray-500">We're expanding! Check back later for more services.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 fade-in">
            {services.map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                index={index}
                onClick={() => handleServiceClick(service, index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
