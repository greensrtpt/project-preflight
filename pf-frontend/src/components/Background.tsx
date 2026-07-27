import React from 'react';

interface BackgroundLayoutProps {
  children: React.ReactNode;
}

export const Background: React.FC<BackgroundLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#fbf9f4] transition-colors z-0">
      {/* 🌟 ตัวแปร Mesh Gradient สำหรับ Light Mode */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-80 dark:opacity-20 transition-opacity"
        style={{
          backgroundImage: `
            radial-gradient(at 0% 100%, #F2BEED 10px, transparent 50%),
            radial-gradient(at 50% 50%, #F3F5E7 10px, transparent 90%),
            radial-gradient(at 30% 30%, #F3F5E7 10px, transparent 90%),
            radial-gradient(at 100% 10%, #C1E5EF 10px, transparent 100%)
          `
        }}
      />

      {/* เนื้อหาภายใน */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};