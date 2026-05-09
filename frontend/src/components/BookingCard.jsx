import React from 'react';
import StatusBadge from './StatusBadge';

export default function BookingCard({ booking, onAccept, onDeliver, isVendor }) {
  const serviceName = booking.serviceId?.name || 'Service';
  const serviceIcon = booking.serviceId?.icon || '📋';
  const customerName = booking.customerId?.name || '';
  const customerAddress = booking.address;

  // Left border color based on status
  const getBorderColor = (status) => {
    switch(status) {
      case 'Pending': return 'border-l-orange-400';
      case 'Accepted': return 'border-l-blue-400';
      case 'Delivered': return 'border-l-green-400';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className={`bg-white p-6 rounded-premium shadow-sm hover:shadow-md border border-gray-100 border-l-[6px] ${getBorderColor(booking.status)} transition-all duration-300`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl border border-gray-100 shadow-inner">
            {serviceIcon}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-app-text mb-1">{serviceName}</h3>
            {isVendor && customerName && (
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-1">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                  {customerName.charAt(0)}
                </span>
                {customerName}
              </div>
            )}
            <p className="text-gray-500 text-sm flex items-start gap-1 max-w-sm">
              <span className="text-gray-400 mt-0.5">📍</span> {customerAddress}
            </p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 flex flex-wrap gap-6 mb-5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">📅</span>
          <span className="font-semibold text-app-text">{booking.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">⏰</span>
          <span className="font-semibold text-app-text">{booking.time}</span>
        </div>
      </div>

      {isVendor && (
        <div className="flex gap-4 pt-2">
          {booking.status === 'Pending' && (
            <button
              onClick={onAccept}
              className="flex-1 bg-[#10b981] text-white px-6 py-3 rounded-btn font-bold hover:bg-[#059669] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Accept Request
            </button>
          )}
          {booking.status === 'Accepted' && (
            <button
              onClick={onDeliver}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-btn font-bold hover:bg-primary-hover transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Mark as Delivered
            </button>
          )}
          {booking.status === 'Pending' && (
            <button className="px-6 py-3 rounded-btn font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all">
              Decline
            </button>
          )}
        </div>
      )}
    </div>
  );
}
