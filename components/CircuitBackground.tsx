
import React from 'react';

const CircuitBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#27272a" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Abstract traces */}
        <g stroke="#71717a" strokeWidth="1.5" fill="none" className="animate-pulse">
          <path d="M 100 100 L 200 100 L 250 150 L 400 150" />
          <circle cx="100" cy="100" r="3" fill="#71717a" />
          <circle cx="400" cy="150" r="3" fill="#71717a" />
          
          <path d="M 800 200 L 850 250 L 850 400" />
          <circle cx="800" cy="200" r="3" fill="#71717a" />
          
          <path d="M 300 600 L 400 600 L 450 650 L 450 800" />
          <circle cx="450" cy="800" r="3" fill="#71717a" />
        </g>
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_85%)]"></div>
    </div>
  );
};

export default CircuitBackground;
