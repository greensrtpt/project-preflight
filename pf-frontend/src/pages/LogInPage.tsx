import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LogInPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ใส่ Logic การล็อกอินตรงนี้
    console.log('Logging in with:', username, password);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans px-4">
      
      {/* การ์ดฟอร์มเข้าสู่ระบบ (Log in Card) */}
      <div className="w-full max-w-[480px] bg-[#D9D9D9] rounded-[32px] p-10 md:p-12 shadow-sm">
        
        {/* หัวข้อ Log in */}
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-8 tracking-tight">
          Log in
        </h1>

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          {/* ช่องกรอก User name */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium text-black pl-1">
              User name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white text-black text-lg py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
              required
            />
          </div>

          {/* ช่องกรอก Password */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium text-black pl-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white text-black text-lg py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
              required
            />
          </div>

          {/* ปุ่ม Submit แอบซ่อนไว้เพื่อให้กด Enter ใน Form แล้วทำงานได้ หรือคุณสามารถปรับชิ้นส่วนอื่นเป็นปุ่ม Log in หลักได้ครับ */}
          <button type="submit" className="hidden">Log In</button>
        </form>

        {/* เส้นคั่นตัวอักษร Or */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-black"></div>
          <span className="px-4 text-lg text-black font-medium">Or</span>
          <div className="flex-grow border-t border-black"></div>
        </div>

        {/* ปุ่ม Create An Account */}
        <Link to="/createACc"
          type="button"
          className="flex items-center justify-center w-full bg-[#9E9E9E] hover:bg-gray-500 text-white text-lg font-medium py-3.5 rounded-xl transition duration-150 shadow-sm"
        >
          Create An Account
        </Link>

      </div>

      {/* ลิงก์ย้อนกลับด้านล่างกล่องเทา */}
      <Link to="/" 
        type="button" 
        className="mt-6 text-gray-500 hover:text-black text-lg font-medium transition duration-150"
      >
        Back to Homepage
      </Link>

    </div>
  );
};

export default LogInPage;