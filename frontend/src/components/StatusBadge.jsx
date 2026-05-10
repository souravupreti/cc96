import React from 'react';

export default function StatusBadge({ status }) {
  const badgeClass = status.toLowerCase();
  
  return (
    <span className={`badge badge-${badgeClass}`} style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px'
    }}>
      <div style={{ 
        width: '6px', 
        height: '6px', 
        borderRadius: '50%', 
        background: 'currentColor' 
      }}></div>
      {status}
    </span>
  );
}
