// src/utils/storage.ts

export const authStorage = {
  // 🌟 บันทึกข้อมูลเข้า localStorage เมื่อ Login สำเร็จ
  setAuth: (token: string, username: string, userId: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("user_id", userId);
  },

  // 🌟 ดึงข้อมูล Token และ User Info ออกมาใช้งาน
  getAuth: () => {
    return {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
      userId: localStorage.getItem("user_id"),
    };
  },

  // 🌟 ดึงเฉพาะ Token
  getToken: () => localStorage.getItem("token"),

  // 🌟 ดึงเฉพาะ Username
  getUsername: () => localStorage.getItem("username"),

  // 🌟 ดึงเฉพาะ User ID
  getUserId: () => localStorage.getItem("user_id"),

  // 🌟 ลบข้อมูล Auth ทั้งหมดออก (ใช้ตอน Logout หรือ Delete Account)
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
  },
};