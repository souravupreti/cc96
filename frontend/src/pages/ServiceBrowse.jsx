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

  const handleServiceClick = (service) => {
    navigate('/booking', { state: { serviceId: service._id } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Browse Services</h1>
          <p className="text-gray-500 text-lg">Choose a service and book instantly</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4 border border-red-200">{error}</div>}

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No services available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onClick={() => handleServiceClick(service)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
