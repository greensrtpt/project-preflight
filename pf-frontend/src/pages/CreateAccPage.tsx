import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ลบ import useEffect ออกได้เลยครับ เพราะเราไม่ได้ใช้แล้ว

const CreateAccPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // ลอจิกตรวจสอบรหัสผ่านของคุณ (เยี่ยมมาก!)
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const isAllValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Create Account ${username} Done!`);
    navigate('/'); 
  };

  return (
    // 1. กล่องพ่อตัวนอกสุด: ใช้ gap-6 สั่งให้กล่องเทา กับ Back to Homepage ห่างกันกำลังดี
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans px-4 gap-6">
      
      {/* 2. กล่องการ์ดสีเทา: เปลี่ยนเป็นแท็ก <form> และใช้ justify-between ดันปุ่มลงล่าง */}
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-[480px] min-h-[550px] bg-[#D9D9D9] rounded-[32px] p-10 md:p-12 shadow-sm flex flex-col justify-between"
      >
        {/* --- ส่วนบน: มัดรวมหัวข้อ และ Input ทั้งหมดไว้ด้วยกัน --- */}
        <div className="flex flex-col gap-4 ">
          
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight w-full ">
            Create Account
          </h1>

          {/* ช่องกรอก Username */}
          <div className="flex flex-col gap-1">
            <label className="text-lg font-medium text-black pl-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white text-black text-lg py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
              required
            />
          </div>

          {/* ช่องกรอก Password */}
          <div className="flex flex-col gap-1">
            <label className="text-lg font-medium text-black pl-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white text-black text-lg py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
              required
            />
          </div>

          {/* ข้อความเตือน (ใช้เงื่อนไข && ซ่อนข้อความที่ผ่านแล้ว เพื่อให้ดูสะอาดตา) */}
          <div className="flex flex-col gap-1 mt-2">
            {!hasMinLength && (
              <p className="text-xs font-medium text-red-600">Password must be at least 8 characters long</p>
            )}
            {!hasUpperCase && (
              <p className="text-xs font-medium text-red-600">Password must contain at least one uppercase letter (A-Z)</p>
            )}
            {!hasLowerCase && (
              <p className="text-xs font-medium text-red-600">Password must contain at least one lowercase letter (a-z)</p>
            )}
            {!hasNumber && (
              <p className="text-xs font-medium text-red-600">Password must contain at least one number (0-9)</p>
            )}
          </div>

        </div>

        {/* --- ส่วนล่าง: ปุ่ม Create Account ถูกย้ายกลับเข้ามาในกล่องเทาแล้ว --- */}
        {/* justify-between จาก form จะทำหน้าที่ดันปุ่มนี้ไปติดขอบล่างของกล่องเทาพอดีเป๊ะ */}
        <button 
          type="submit"
          disabled={!isAllValid}
          className={`w-full text-lg font-medium py-3.5 rounded-xl transition duration-150 shadow-sm mt-6 ${
            isAllValid 
              ? 'bg-[#9E9E9E] hover:bg-gray-500 text-white cursor-pointer' 
              : 'bg-gray-400 text-gray-200 opacity-50 cursor-not-allowed'
          }`}
        >
          Create An Account
        </button>

      </form>

      {/* 3. ลิงก์ย้อนกลับ (จัดระยะห่างด้วย gap-6 ของกล่องพ่อแล้ว) */}
      <Link 
        to="/" 
        className="text-gray-400 hover:text-black text-lg font-medium transition duration-150"
      >
        Back to Homepage
      </Link>

    </div>
  );
};

export default CreateAccPage;