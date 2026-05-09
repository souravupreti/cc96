import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    'Pending': 'bg-orange-50 text-orange-600 border-orange-100',
    'Accepted': 'bg-blue-50 text-blue-600 border-blue-100',
    'Delivered': 'bg-green-50 text-green-600 border-green-100'
  };

  const icons = {
    'Pending': '⏳',
    'Accepted': '👍',
    'Delivered': '✓'
  };

  const color = styles[status] || 'bg-gray-50 text-gray-600 border-gray-100';
  const icon = icons[status] || '';

  return (
    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${color} shadow-sm`}>
      <span>{icon}</span> {status}
    </span>
  );
}
