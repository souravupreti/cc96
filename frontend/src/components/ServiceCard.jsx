import React from 'react';
import { Home, Wrench, Zap, Paintbrush, Bug, ChevronRight } from 'lucide-react';

export default function ServiceCard({ service, onClick }) {
  const getServiceIcon = (iconName) => {
    const props = { size: 32, color: 'var(--purple)' };
    switch(iconName) {
      case 'Home': return <Home {...props} />;
      case 'Wrench': return <Wrench {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Paintbrush': return <Paintbrush {...props} />;
      case 'Bug': return <Bug {...props} />;
      default: return <Zap {...props} />;
    }
  };

  return (
    <div className="card-3d" style={{ padding: '24px', cursor: 'pointer' }} onClick={onClick}>
      <div className="icon-box" style={{ marginBottom: '20px' }}>
        {getServiceIcon(service.icon)}
      </div>
      <h3 style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '800' }}>{service.name}</h3>
      <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '20px', height: '40px', overflow: 'hidden' }}>
        {service.description}
      </p>
      <div className="text-gradient" style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>
        ₹{service.basePrice}
      </div>
      <button className="btn-premium btn-premium-orange" style={{ width: '100%', padding: '10px 16px', fontSize: '14px' }}>
        Book Now <ChevronRight size={16} />
      </button>
    </div>
  );
}
