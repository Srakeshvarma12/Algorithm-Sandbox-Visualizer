import React from 'react';

export default function StatusBadge({ status }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'running':
        return { label: 'RUNNING', color: 'var(--accent-indigo)' };
      case 'paused':
        return { label: 'PAUSED', color: 'var(--color-warning)' };
      case 'complete':
        return { label: 'COMPLETE', color: 'var(--color-success)' };
      case 'error':
        return { label: 'ERROR', color: 'var(--color-error)' };
      case 'idle':
      default:
        return { label: 'IDLE', color: 'var(--text-muted)' };
    }
  };

  const config = getBadgeConfig();

  return (
    <div 
      className="badge-chronos d-inline-flex align-items-center"
      style={{ borderColor: config.color, color: config.color }}
    >
      <span 
        className="me-2 rounded-circle" 
        style={{ 
          width: '6px', 
          height: '6px', 
          background: config.color,
          boxShadow: `0 0 10px ${config.color}`
        }} 
      />
      {config.label}
    </div>
  );
}
