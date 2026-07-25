import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ลบ import useEffect ออกได้เลยครับ เพราะเราไม่ได้ใช้แล้ว

const CreateAccPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [passwordError,setPasswordError] = useState('');

  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ลอจิกตรวจสอบรหัสผ่านของคุณ (เยี่ยมมาก!)
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isAllValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
  const navigate = useNavigate();

  const showPasswordError = (isPasswordTouched || isSubmitted) && !isAllValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!username.trim()) {
      setPasswordError("password is required");
      hasError = true;
    }
    
    setPasswordError("");
    setIsSubmitted(true);

    if (hasError) return;

    // 🚀 ยิง API สมัครสมาชิกไปยัง Backend
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create account");
        return;
      }

      alert(`Create Account ${username} Success!`);
      navigate('/login'); 

    } catch (error) {
      console.error("Create account error:", error);
      alert("Cannot connect to server. Please try again.");
    }
  };

  // 🌟 ฟังก์ชันเมื่อพิมพ์ Username
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setUsername(value);
    };
  
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPassword(value);
      if (!isPasswordTouched) setIsPasswordTouched(true);
      if (value.trim()) {
        setPasswordError("");
      }
    };

  return (
    // 1. กล่องพ่อตัวนอกสุด: ใช้ gap-6 สั่งให้กล่องเทา กับ Back to Homepage ห่างกันกำลังดี
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      
      {/* 2. กล่องการ์ดสีเทา: เปลี่ยนเป็นแท็ก <form> และใช้ justify-between ดันปุ่มลงล่าง */}
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md min-h-[450px] bg-[#D9D9D9] rounded-[32px] md:p-8 shadow-sm flex flex-col justify-between"
      >
        {/* --- ส่วนบน: มัดรวมหัวข้อ และ Input ทั้งหมดไว้ด้วยกัน --- */}
        <div className="flex flex-col gap-4 ">
          
          <h1 className="text-3xl font-bold text-black mb-3 text-left">
            Create Account
          </h1>

          {/* ช่องกรอก Username */}
          <div className="space-y-1 text-left">
            <label className="block text-sm font-semibold text-black">Username</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="username is required"
              className={`w-full bg-white text-black text-lg py-3 px-4 rounded-xl focus:outline-none focus:ring-2 shadow-sm transition-colors `}
            />
          </div>

          {/* ช่องกรอก Password */}
          <div className="space-y-1 text-left">
            <label className="block text-sm font-semibold text-black">Password</label>
            <input
              type="text"
              value={password}
              onChange={handlePasswordChange}
              placeholder={password?"":passwordError}
              className={`w-full bg-white text-black text-lg py-3 px-4 rounded-xl focus:outline-none focus:ring-2 shadow-sm transition-colors ${
                         showPasswordError
               ? "bg-red-50 border-2 border-red-500 focus:ring-2 focus:ring-red-400 placeholder:text-red-400"
                  : "bg-white focus:ring-2 focus:ring-gray-400"
               }`}
            />
          </div>

          {/* ข้อความเตือน (ใช้เงื่อนไข && ซ่อนข้อความที่ผ่านแล้ว เพื่อให้ดูสะอาดตา) */}
          {showPasswordError && (<div className="flex flex-col gap-1">
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
          )}

        </div>

        {/* --- ส่วนล่าง: ปุ่ม Create Account ถูกย้ายกลับเข้ามาในกล่องเทาแล้ว --- */}
        {/* justify-between จาก form จะทำหน้าที่ดันปุ่มนี้ไปติดขอบล่างของกล่องเทาพอดีเป๊ะ */}
        <button 
          type="submit"
          disabled={!isAllValid}
          className={`w-full h-11 bg-[#9E9E9E] hover:bg-[#8E8E8E] text-white font-medium rounded-lg transition-colors duration-200 mt-2 ${
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
        className="mt-4 text-sm text-[#9E9E9E] hover:text-gray-600 font-medium transition-colors duration-200"
      >
        Back to Homepage
      </Link>

    </div>
  );
};

export default CreateAccPage;