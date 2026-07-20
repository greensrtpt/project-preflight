import React, { useState } from 'react';
import { Search } from 'lucide-react'; // นำเข้าไอคอนแว่นขยาย
import { Link } from 'react-router-dom';

const Searchpage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ส่วนหัว (Header) */}
      <header className="flex justify-end p-6 md:p-8">
        <Link to="/login" className="bg-[#E2E2E2] hover:bg-gray-300 text-black text-lg font-medium px-8 py-2.5 rounded-full shadow-sm transition duration-150">
          log in
        </Link>
      </header>

      {/* ส่วนเนื้อหาหลัก (Main Content) */}
      <main className="flex flex-col items-center justify-center pt-20 md:pt-32">
        {/* ข้อความหัวข้อ */}
        <h1 className="text-6xl md:text-7xl font-bold text-black mb-12 tracking-tight">
          Search Space
        </h1>

        {/* แถบค้นหา */}
        <div className="relative w-full max-w-[650px] px-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#E2E2E2] text-black text-xl py-4 pl-8 pr-16 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-inner"
            placeholder="Search..." // เพิ่ม placeholder เพื่อให้ดูสมบูรณ์ขึ้น
          />
          {/* ไอคอนแว่นขยาย */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <Search className="h-7 w-7 text-gray-700" strokeWidth={2.5} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Searchpage;