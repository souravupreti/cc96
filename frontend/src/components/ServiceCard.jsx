import React from 'react';

export default function ServiceCard({ service, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white border border-gray-200 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200"
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
      <h3 className="text-lg font-bold mb-1 text-gray-900">{service.name}</h3>
      <p className="text-gray-500 text-sm mb-3 leading-relaxed">{service.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-blue-700 font-extrabold text-lg">₹{service.basePrice}</span>
        <span className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Book →</span>
      </div>
    </div>
  );
}
