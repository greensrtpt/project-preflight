import React, { useState } from "react";
import { Link } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 🌟 ฟังก์ชัน Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setUsernameError("username is required");
    }
    if (!username.trim()) {
      setPasswordError("password is required");
    }
    else{
    setUsernameError("");
    setPasswordError("");
    console.log("Logging in with:", { username, password });}
    // TODO: ยิง API Login ต่อ
  };

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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Card Container */}
      <div className="w-full max-w-md bg-[#D9D9D9] rounded-[32px] p-8 shadow-sm">
        {/* Header */}
        <h1 className="text-3xl font-bold text-black mb-6 text-left">Log in</h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-1 text-left">
            <label className="block text-sm font-semibold text-black">
              Username
            </label>
            <input
              type="text"
              value={username}
              placeholder={username?"":usernameError}
              onChange={handleUsernameChange}
              className={`w-full h-11 px-4 rounded-lg focus:outline-none transition-colors text-black text-sm ${
                usernameError
                  ? "bg-red-50 border-2 border-red-500 focus:ring-2 focus:ring-red-400 placeholder:text-red-400"
                  : "bg-white focus:ring-2 focus:ring-gray-400"
              }`}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1 text-left">
            <label className="block text-sm font-semibold text-black">
              Password
            </label>
            <input
              type="text"
              value={password}
              placeholder={password?"":passwordError}
              onChange={handlePasswordChange}
              className={`w-full h-11 px-4 rounded-lg focus:outline-none transition-colors text-black text-sm ${
                passwordError
                  ? "bg-red-50 border-2 border-red-500 focus:ring-2 focus:ring-red-400 placeholder:text-red-400"
                  : "bg-white focus:ring-2 focus:ring-gray-400"
              }`}
            />
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            className="w-full h-11 bg-[#9E9E9E] hover:bg-[#8E8E8E] text-white font-medium rounded-lg transition-colors duration-200 mt-2"
          >
            Log In
          </button>
        </form>

        {/* Divider เส้นกั้น Or */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-black w-full"></div>
          <span className="bg-[#D9D9D9] px-3 text-sm text-black font-medium absolute">
            Or
          </span>
        </div>

        {/* Create An Account Button (แต่ง Link ให้เป็นปุ่มตรงๆ) */}
        <Link
          to="/createAcc"
          className="w-full h-11 bg-[#9E9E9E] hover:bg-[#8E8E8E] text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          Create An Account
        </Link>
      </div>

      {/* Back to Homepage Link ด้านล่าง */}
      <Link
        to="/"
        className="mt-4 text-sm text-[#9E9E9E] hover:text-gray-600 font-medium transition-colors duration-200"
      >
        Back to Homepage
      </Link>
    </div>
  );
};

export default LoginPage;