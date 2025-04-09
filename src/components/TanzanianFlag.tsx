// src/components/TanzanianFlag.tsx
import React from "react";

const TanzanianFlag = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="90"
      height="60"
      viewBox="0 0 90 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Green upper triangle */}
      <polygon points="0,0 90,0 0,60" fill="#00FF00" />
      {/* Blue lower triangle */}
      <polygon points="90,0 90,60 0,60" fill="#00B7EB" />
      {/* Black diagonal stripe */}
      <polygon points="0,60 15,60 90,0 75,0" fill="#000000" />
      {/* Yellow borders */}
      <polygon points="0,60 3,60 78,0 75,0" fill="#FFC107" />
      <polygon points="12,60 15,60 90,0 87,0" fill="#FFC107" />
    </svg>
  );
};

export default TanzanianFlag;