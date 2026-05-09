import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Accepted': 'bg-blue-100 text-blue-800 border-blue-200',
    'Delivered': 'bg-green-100 text-green-800 border-green-200'
  };

  const icons = {
    'Pending': '⏳',
    'Accepted': '✓',
    'Delivered': '✓✓'
  };

  const color = styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  const icon = icons[status] || '';

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
      {icon} {status}
    </span>
  );
}
