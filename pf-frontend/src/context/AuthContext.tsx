// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authStorage } from '../utils/storage'; // 🌟 ดึง helper storage ที่เราสร้างไว้มาใช้

interface AuthContextType {
  username: string | null;
  login: (token: string, username: string, user_id: string) => void;
  logout: () => void;
}

// 1. สร้าง Context กลาง
const AuthContext = createContext<AuthContextType | null>(null);

// 2. สร้าง Provider ตัวกระจาย ข้อมูล State ให้ทั้ง App
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);

  // ดึงข้อมูล username จาก storage ครั้งแรกเมื่อเปิด/โหลดเว็บ
  useEffect(() => {
    const savedUsername = authStorage.getUsername();
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // ฟังก์ชัน Login กลาง
  const login = (token: string, username: string, user_id: string) => {
    authStorage.setAuth(token, username, user_id);
    setUsername(username); // 🌟 อัปเดต State กลาง -> ทุกหน้าเปลี่ยนตามทันที
  };

  // ฟังก์ชัน Logout กลาง
  const logout = () => {
    authStorage.clearAuth();
    setUsername(null); // 🌟 เคลียร์ State กลาง -> ทุกหน้าลบตามทันที
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. สร้าง Custom Hook ให้ดึงไปใช้ง่ายๆ
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};