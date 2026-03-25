import React from 'react';

export default function LiquidButton({
  children,
  variant  = 'default',  // 'default' | 'primary' | 'danger'
  size     = 'md',       // 'sm' | 'md' | 'lg'
  onClick,
  disabled = false,
  icon     = null,
  className = '',
}) {
  return (
    <button
      className={`btn-liquid btn-${variant} btn-size-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {icon && <span className="btn-icon me-2">{icon}</span>}
      <span className="btn-label">{children}</span>
    </button>
  );
}
