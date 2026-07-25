import SmoothDropdown from '../components/SmoothDropdown';
import type { DropdownOption } from '../Types/dropdown.types';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect,useState, useRef } from "react";

const Searchpage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  // const [Loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
  const savedUsername = localStorage.getItem("username");
     console.log(savedUsername);
  if (savedUsername) {
    setUsername(savedUsername);
  }
  }, []);
  // 1. เตรียมข้อมูล Options (ต้องมี topic_id และ topic_name ตรงตาม Interface)
  const topicList: DropdownOption[] = [
    { topic_id: '996c5d4e-2fb3-4436-bfbf-00c65e62685c', topic_name: 'activities' },
    { topic_id: '965b6a4c-b18e-41f9-b824-34dbec8ec82a', topic_name: 'study' },
    { topic_id: '42fa09c9-2f6a-44e6-9236-6e1905a6d047', topic_name: 'university life' },
  ];

  // 2. สร้างฟังก์ชันรับค่าเมื่อ User คลิกเลือก
  const handleSelectTopic = async (selectedOption: DropdownOption) => {
    console.log('User chooses topic ID:', selectedOption.topic_id);
    console.log('User chooses topic name:', selectedOption.topic_name);
    navigate(`/showAllPost/${selectedOption.topic_id}`);
    // finally {
    //   setLoading(false);
    // }
  };

  const handleLogout = async () => {
  // 1. ลบข้อมูลทั้งหมดที่เคยเซฟไว้ใน localStorage
  console.log("logout button is clicked")
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("user_id");
  // หรือใช้ localStorage.clear(); เพื่อลบทั้งหมดในทีเดียวก็ได้ครับ

  // 2. อัปเดต State ให้ UI เปลี่ยนกลับเป็นปุ่ม "log in" ทันที
  setUsername(null);
  setIsOpen(false);

  // 3. (Optional) พา User เด้งกลับไปหน้า Login หรือ หน้าแรก
  navigate("/");
};

  const handleDelete = async () => {
    console.log("delete button is clicked")
    const isConfirmed = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );
  if (!isConfirmed) return;

     try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");

      if (!token || !userId) {
        alert("No token or user info found. Please log in again.");
        return;
      } 

    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // แนบตั๋วเพื่อบอก Backend ว่าใครสั่งลบ
      },
    });
      const data = await response.json();
      // ❌ 3. ถ้า Login ไม่ผ่าน (เช่น Status 400, 401, 404, 500)
      if (!response.ok) {
        alert(data.message || "Failed to delete account");
        return;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
  // หรือใช้ localStorage.clear(); เพื่อลบทั้งหมดในทีเดียวก็ได้ครับ

  // 2. อัปเดต State ให้ UI เปลี่ยนกลับเป็นปุ่ม "log in" ทันที
    setUsername(null);
    alert("Account deleted successfully.");
    setIsOpen(false);
    } catch (error) {
            console.error('Error fetching posts:', error);
            alert("Cannot connect to server. Please try again.");
    }
  }
  
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ส่วนหัว (Header) */}
      <header className="flex justify-end p-6 md:p-8">
        <div className="fixed top-6 right-6">
  {username ? (
    /* 🌟 กรณี Log in แล้ว: แสดงปุ่มตามรูปแรก */
    <div className="absolute top-full right-0 mt-2 flex flex-col items-end z-20">
      {/* 🌟 กล่อง Profile ชนิดกดเปิด/ปิด Menu */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen)}}
        className="bg-[#D9D9D9] hover:bg-gray-300 transition-colors rounded-full px-5 py-2 flex items-center gap-3 shadow-sm cursor-pointer border-none outline-none"
      >
        <span className="text-black font-semibold text-base">{username}</span>
        <div className="w-8 h-8 bg-[#EBEBEB] rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      </button>

      {/* 🌟 Popover Menu (แสดงเฉพาะเมื่อ isOpen === true) */}
      {isOpen && (
        <div className="absolute top-full mt-2 flex flex-col items-end z-50" 
        onClick={(e) => e.stopPropagation()}>
          {/* หางสามเหลี่ยมชี้ขึ้น (Tooltip Arrow) */}
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[12px] border-b-[#D9D9D9] mr-6"></div>

          {/* กล่องเมนูสีเทา */}
          <div className="bg-[#D9D9D9] rounded-2xl p-3 shadow-md flex flex-col gap-2 w-48">
            {/* ปุ่ม Log Out */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout()
              }}
              className="w-full bg-[#FF8A8A] hover:bg-[#FF7575] text-[#D00000] font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer text-center text-sm z-50"
            >
              log out
            </button>

            {/* ปุ่ม Delete Account */}
            <button
              onClick={ (e) => {
                e.stopPropagation();
                handleDelete()}}
              className="w-full bg-[#FF8A8A] hover:bg-[#FF7575] text-[#D00000] font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer text-center text-sm z-50"
            >
              delete account
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    /* 🌟 กรณีที่ยังไม่ได้ Log in: แสดงปุ่ม log in ปกติ */
    <Link
      to="/login"
      className="h-11 bg-[#D9D9D9] hover:bg-gray-300 text-black text-sm font-semibold px-6 rounded-full transition-colors flex items-center justify-center leading-none"
    >
      log in
    </Link>
  )}
  </div>
      </header>

      {/* ส่วนเนื้อหาหลัก (Main Content) */}
      <main className="flex flex-col items-center justify-center pt-20 md:pt-32">
        {/* ข้อความหัวข้อ */}
        <h1 className="text-6xl md:text-7xl font-bold text-black mb-12 tracking-tight">
          Select Topic
        </h1>

        <div>
          <SmoothDropdown 
            options={topicList}
            onSelectOption={handleSelectTopic}
          ></SmoothDropdown>
        </div>
      </main>
    </div>
  );
};

export default Searchpage;