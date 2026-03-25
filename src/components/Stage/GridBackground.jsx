import React from 'react';

export default function GridBackground() {
  return (
    <div 
      className="position-fixed inset-0" 
      style={{ 
        zIndex: -1, 
        width: '100%', 
        height: '100%', 
        background: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(217, 70, 239, 0.05) 0%, transparent 50%)' 
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
