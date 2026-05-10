import React from 'react';
import StatusBadge from './StatusBadge';
import { 
  Home, Wrench, Zap, Paintbrush, Bug, MapPin, 
  Calendar, Clock, User, ChevronRight, CheckCircle, 
  XCircle 
} from 'lucide-react';

export default function BookingCard({ booking, onAccept, onDeliver, onDecline, onCancel, isVendor }) {
  const serviceName = booking.serviceId?.name || 'Service';
  const serviceIconName = booking.serviceId?.icon || 'Zap';
  const customerName = booking.customerId?.name || '';
  const customerAddress = booking.address;

  const getServiceIcon = (iconName) => {
    const props = { size: 28, color: 'var(--purple)' };
    switch(iconName) {
      case 'Home': return <Home {...props} />;
      case 'Wrench': return <Wrench {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Paintbrush': return <Paintbrush {...props} />;
      case 'Bug': return <Bug {...props} />;
      default: return <Zap {...props} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#FF6B35';
      case 'Accepted': return '#6C3BF5';
      case 'Delivered': return '#22C55E';
      default: return '#6B7280';
    }
  };

  return (
    <div className="booking-card" style={{ borderLeftColor: getStatusColor(booking.status) }}>
      <div className="booking-card-info-wrap" style={{ display: 'flex', gap: '24px', flex: 1 }}>
        <div className="icon-box booking-card-icon" style={{ margin: 0, width: '64px', height: '64px', background: 'var(--purple-light)', flexShrink: 0 }}>
          {getServiceIcon(serviceIconName)}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>{serviceName}</h3>
            <div className="status-badge-float">
              <StatusBadge status={booking.status} />
            </div>
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            {isVendor && customerName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dark)', fontWeight: '600', fontSize: '14px' }}>
                <User size={16} color="var(--purple)" /> {customerName}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)', fontSize: '14px' }}>
              <MapPin size={16} color="var(--purple)" /> {customerAddress}
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '4px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--dark)', fontWeight: '600', fontSize: '13px', background: '#F0F0F0', padding: '4px 12px', borderRadius: '50px' }}>
                <Calendar size={14} color="var(--purple)" /> {booking.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--dark)', fontWeight: '600', fontSize: '13px', background: '#F0F0F0', padding: '4px 12px', borderRadius: '50px' }}>
                <Clock size={14} color="var(--purple)" /> {booking.time}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-card-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '180px' }}>
        {isVendor ? (
          <>
            {booking.status === 'Pending' && (
              <>
                <button onClick={onAccept} className="btn-premium" style={{ background: '#22C55E', boxShadow: '0 4px 15px rgba(34,197,94,0.3)', padding: '10px' }}>
                  <CheckCircle size={18} /> Accept
                </button>
                <button onClick={onDecline} className="btn-outline" style={{ borderColor: '#EF4444', color: '#EF4444', padding: '8px' }}>
                  <XCircle size={18} /> Decline
                </button>
              </>
            )}
            {booking.status === 'Accepted' && (
              <button onClick={onDeliver} className="btn-premium" style={{ background: '#3B82F6', boxShadow: '0 4px 15px rgba(59,130,246,0.3)', padding: '12px' }}>
                <CheckCircle size={18} /> Mark Delivered
              </button>
            )}
          </>
        ) : (
          booking.status === 'Pending' && (
            <button onClick={onCancel} className="btn-outline" style={{ borderColor: 'var(--orange)', color: 'var(--orange)', padding: '10px' }}>
              <XCircle size={18} /> Cancel
            </button>
          )
        )}
      </div>
    </div>
  );
}
