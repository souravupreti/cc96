import React from 'react';

export default function ServiceCard({ service, onClick, index = 0 }) {
  const getServiceColor = (idx) => {
    const colors = ['bg-blue-50 text-blue-600', 'bg-orange-50 text-orange-600', 'bg-purple-50 text-purple-600', 'bg-green-50 text-green-600', 'bg-pink-50 text-pink-600'];
    return colors[idx % colors.length];
  };

  const colorClass = getServiceColor(index);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-premium border border-gray-100 p-6 cursor-pointer hover:shadow-premium hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 group flex flex-col h-full"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300 ${colorClass}`}>
        {service.icon}
      </div>
      <h3 className="text-lg font-bold text-app-text mb-2">{service.name}</h3>
      <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">{service.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xl font-extrabold text-app-text">₹{service.basePrice}</span>
        <button className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 bg-secondary text-white px-5 py-2 rounded-btn text-sm font-bold shadow-md transition-all duration-300">
          Book
        </button>
      </div>
    </div>
  );
}
