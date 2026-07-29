import { Link} from 'react-router-dom';
import React, { useState } from "react";
import { authStorage } from '../utils/storage'; 
import { useAuth } from '../context/AuthContext';

const LogInButton: React.FC = () => {
      const [isOpen, setIsOpen] = useState(false);
      const { username,logout } = useAuth();

      const handleLogout = async () => {
  // 1. ลบข้อมูลทั้งหมดที่เคยเซฟไว้ใน localStorage
        console.log("logout button is clicked");
        logout()
        setIsOpen(false);
     };

    const handleDelete = async () => {
    console.log("delete button is clicked")
    const isConfirmed = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );
  if (!isConfirmed) return;

     try {
      const token = authStorage.getToken();
      const userId = authStorage.getUserId();

      if (!token || !userId) {
        alert("No token or user info found. Please log in again.");
        return;
      } 

    const response = await fetch(`/users/${userId}`, {
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
    logout()
    alert("Account deleted successfully.");
    setIsOpen(false);
    } catch (error) {
            console.error('Error fetching posts:', error);
            alert("Cannot connect to server. Please try again.");
    }
  }

    return(
    <div className="relative top-6 right-6">
  {username ? (
    /* 🌟 กรณี Log in แล้ว: แสดงปุ่มตามรูปแรก */
    <div className="absolute top-full right-0 mt-2 flex flex-col items-end z-20">
      {/* 🌟 กล่อง Profile ชนิดกดเปิด/ปิด Menu */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen)}}
        className="bg-[#FFFCFC] hover:bg-[#DED2E2] transition-colors rounded-full px-5 py-2 flex items-center gap-3 shadow-sm cursor-pointer border-2 border-[#626161] outline-none "
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
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[12px] border-b-[#626161] mr-6 drop-shadow-[0_-1.5px_0px_#605F5F]"></div>

          {/* กล่องเมนูสีเทา */}
          <div className="bg-[#FFFCFC] rounded-2xl p-3 shadow-md flex flex-col gap-2 w-48 border-2 border[#626161]">
            {/* ปุ่ม Log Out */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout()
              }}
              className="w-full bg-[#FD9F9D] hover:bg-[#FF7575] text-[#626161] hover:text-[#FFFCFC] font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer text-center text-sm z-50"
            >
              log out
            </button>

            {/* ปุ่ม Delete Account */}
            <button
              onClick={ (e) => {
                e.stopPropagation();
                handleDelete()}}
               className="w-full bg-[#FD9F9D] hover:bg-[#FF7575] hover:text-[#FFFCFC] text-[#626161] font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer text-center text-sm z-50"
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
      className="h-11 bg-[#FFFCFC] hover:bg-[#DED2E2] text-[#626161] text-sm font-semibold px-6 rounded-full transition-colors flex items-center justify-center leading-none border-2"
    >
      log in
    </Link>
  )}
  </div>)
}

export default LogInButton;