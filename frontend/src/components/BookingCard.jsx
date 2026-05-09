import React from 'react';
import StatusBadge from './StatusBadge';

export default function BookingCard({ booking, onAccept, onDeliver, isVendor }) {
  const serviceName = booking.serviceId?.name || 'Service';
  const serviceIcon = booking.serviceId?.icon || '📋';
  const customerName = booking.customerId?.name || '';
  const customerAddress = booking.address;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{serviceIcon}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{serviceName}</h3>
            {isVendor && customerName && (
              <p className="text-gray-500 text-sm">Customer: {customerName}</p>
            )}
            <p className="text-gray-500 text-sm">{customerAddress}</p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4 bg-gray-50 rounded-xl p-3">
        <p><span className="font-semibold text-gray-700">Date:</span> {booking.date}</p>
        <p><span className="font-semibold text-gray-700">Time:</span> {booking.time}</p>
      </div>
      {isVendor && (
        <div className="flex gap-3">
          {booking.status === 'Pending' && (
            <button
              onClick={onAccept}
              className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-sm"
            >
              ✓ Accept
            </button>
          )}
          {booking.status === 'Accepted' && (
            <button
              onClick={onDeliver}
              className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-sm"
            >
              📦 Mark Delivered
            </button>
          )}
        </div>
      )}
    </div>
  );
}
