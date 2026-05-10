import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ServiceCard from '../components/ServiceCard';
import { LayoutGrid, RefreshCw, Search } from 'lucide-react';

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
    <div className="page">
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px' }}>
              <LayoutGrid size={32} color="white" />
            </div>
            <div>
              <h1 style={{ margin: 0 }}>Available Services</h1>
              <p style={{ opacity: 0.8, margin: 0 }}>Choose from our range of verified professional services.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        {error && (
          <div style={{ color: '#E65100', background: '#FFF3E0', padding: '16px', borderRadius: '12px', marginBottom: '32px', fontWeight: '500', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <RefreshCw size={48} color="var(--purple)" className="animate-spin" />
            <p style={{ marginTop: '16px', color: 'var(--gray)', fontWeight: '600' }}>Fetching services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="card-3d" style={{ textAlign: 'center', padding: '100px 40px' }}>
            <div className="icon-box" style={{ width: '80px', height: '80px' }}>
              <Search size={40} color="var(--purple)" />
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>No services found</h3>
            <p style={{ color: 'var(--gray)' }}>We're working on adding more categories. Stay tuned!</p>
          </div>
        ) : (
          <div className="services-grid" style={{ display: 'grid', gap: '24px' }}>
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
