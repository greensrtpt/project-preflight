import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Background } from "../components/Background";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const {login} = useAuth();

  // 🌟 ฟังก์ชัน Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!username.trim()) {
      setUsernameError("username is required");
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError("password is required");
      hasError = true;
    }
    if(hasError){ return; }
    setUsernameError("");
    setPasswordError("");
    console.log("Logging in with:", { username, password });
    // TODO: ยิง API Login ต่อ
    try {
      // 🚀 2. ยิง POST Request ไปหา Backend API
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await response.json();
      // ❌ 3. ถ้า Login ไม่ผ่าน (เช่น Status 400, 401, 404, 500)
      if (!response.ok) {
        alert(data.message || "Invalid username or password");
        return;
      }
      login(data.token,data.username,data.password);

      alert("Login successful!");

      // 🚀 5. พา User เด้งไปหน้าแรก (Homepage / Dashboard)
      navigate(`/`);
  }catch(err){
    console.error("Login Error:", err);
    alert("Cannot connect to server. Please try again.");
  }
}

  // 🌟 ฟังก์ชันเมื่อพิมพ์ Username
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (value.trim()) {
      setUsernameError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value.trim()) {
      setPasswordError("");
    }
  };

  return (
    <Background>
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Card Container */}
      <div className="w-full max-w-md bg-[#FFFCFC] rounded-[32px] p-8 shadow-sm border-2 border-[#626161]">
        {/* Header */}
        <h1 className="text-3xl font-bold text-[#626161] mb-6 text-left">Log in</h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-1 text-left">
            <label className="block text-sm font-semibold text-[#626161]">
              Username
            </label>
            <input
              type="text"
              value={username}
              placeholder={username?"":usernameError}
              onChange={handleUsernameChange}
              className={`w-full h-11 px-4 rounded-lg focus:outline-none transition-colors text-[#626161] text-sm ${
                usernameError
                  ? "bg-red-50 border-2 border-red-500 focus:ring-2 focus:ring-red-400 placeholder:text-red-400"
                  : "bg-[#DED2E2] focus:ring-2 focus:ring-gray-400"
              }`}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1 text-left">
            <label className="block text-sm font-semibold text-[#626161">
              Password
            </label>
            <input
              type="password"
              value={password}
              placeholder={password?"":passwordError}
              onChange={handlePasswordChange}
              className={`w-full h-11 px-4 rounded-lg focus:outline-none transition-colors text-[#626161] text-sm ${
                passwordError
                  ? "bg-red-50 border-2 border-red-500 focus:ring-2 focus:ring-red-400 placeholder:text-red-400"
                  : "bg-[#DED2E2] focus:ring-2 focus:ring-gray-400"
              }`}
            />
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            className="w-full h-11 bg-[#C39AF6] hover:bg-[#B478FF] text-white font-medium rounded-lg transition-colors duration-200 mt-2"
          >
            Log In
          </button>
        </form>

        {/* Divider เส้นกั้น Or */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-[#626161] w-full"></div>
          <span className="bg-[#FFFCFC] px-3 text-sm text-[#626161] font-medium absolute">
            Or
          </span>
        </div>

        {/* Create An Account Button (แต่ง Link ให้เป็นปุ่มตรงๆ) */}
        <Link
          to="/createAcc"
          className="w-full h-11 bg-[#C39AF6] hover:bg-[#B478FF] text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          Create An Account
        </Link>
      </div>

      {/* Back to Homepage Link ด้านล่าง */}
      <Link
        to="/"
        className="mt-4 text-sm text-[#626161] hover:text-gray-600 font-medium transition-colors duration-200"
      >
        Back to Homepage
      </Link>
    </div>
    </Background>
  );
};

export default LoginPage;