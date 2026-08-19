import React from "react";

export const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Subtle Global Technical Grid Pattern */}
      <div className="absolute inset-0 bg-tech-grid opacity-[0.45]" />

      {/* 2. Top-Center Ambient Purple Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px]" />

      {/* 3. Right Ambient Blue-Violet Glow */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]" />

      {/* 4. Left Ambient Purple Glow */}
      <div className="absolute top-[50%] left-[-10%] w-[500px] h-[500px] bg-purple-700/8 rounded-full blur-[140px]" />

      {/* 5. Faint Digital Dots / Stars Accent */}
      <div className="absolute top-24 left-[15%] w-1 h-1 rounded-full bg-purple-400/40 shadow-[0_0_8px_#a855f7]" />
      <div className="absolute top-48 right-[20%] w-1.5 h-1.5 rounded-full bg-indigo-400/30 shadow-[0_0_6px_#818cf8]" />
      <div className="absolute top-[60%] right-[12%] w-1 h-1 rounded-full bg-purple-300/30 shadow-[0_0_8px_#c084fc]" />
      <div className="absolute top-[75%] left-[8%] w-1.5 h-1.5 rounded-full bg-indigo-300/25 shadow-[0_0_6px_#6366f1]" />
    </div>
  );
};
