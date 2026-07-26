import React, { useState } from 'react';
import type {CreatePostModalProps} from '../Types/Modal.types.ts'
import { authStorage } from '../utils/storage.ts';

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  topic_id,
  group_id,
  topic_name,
  group_name,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  // ฟังก์ชันคำนวณจำนวนคำ (Word Count)
  const getWordCount = (text: string) => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  };

  const wordCount = getWordCount(description);
  const maxWords = 150;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    // ถ้าคำเกิน 150 คำ จะไม่ให้พิมพ์เพิ่ม
    if (getWordCount(newText) <= maxWords || newText.length < description.length) {
      setDescription(newText);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !description.trim()) {
      alert('Please fill both Title and Description');
      return;
      }

      const token = authStorage.getToken();

      if (!token) {
      alert('Please Login before create post');
      return;
      }
    // ล้างข้อมูลและปิด Modal
      try {
        // 🚀 2. ยิง POST Request ไปหา Backend API
        const response = await fetch(`http://localhost:3001/posts/${topic_id}/${group_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title,
            descriptions: description,
          }),
        });
        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Cannot create post");
          return;
        }

         setTitle('');
         setDescription('');
         onClose();
         alert("Create post successful!");
         window.location.reload();
  
    }catch(err){
      console.error("Login Error:", err);
      alert("Cannot connect to server. Please try again.");
      return;
    }
  }

  // วันที่ปัจจุบันในฟอร์แมต DD/MM/YYYY
  const currentDate = new Date().toLocaleDateString('en-GB');
  const username = authStorage.getUsername();

  return (
    /* Background Overlay */
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      {/* Modal Card Container */}
      <div className="relative bg-[#D9D9D9] w-full max-w-2xl rounded-3xl p-8 shadow-xl flex flex-col gap-4">
        
        {/* 🌟 ปุ่ม X สีแดงตรงมุมซ้ายบน */}
        <button
          onClick={onClose}
          className="absolute -top-3 -left-3 bg-red-400 hover:bg-red-500 text-white font-bold w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors"
        >
          X
        </button>

        <form onSubmit={handlePost} className="flex flex-col gap-4">
          {/* 🌟 ช่องกรอก Title */}
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#EAEAEA] text-2xl font-bold placeholder-black/40 text-black px-4 py-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* 🌟 ช่องกรอก Description พร้อม Word Counter */}
          <div className="relative bg-[#EAEAEA] rounded-xl p-4 flex flex-col h-64">
            <textarea
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full flex-1 bg-transparent resize-none text-base text-black placeholder-black/40 border-none focus:outline-none"
            />
            {/* ตัวนับจำนวนคำด้านขวาล่าง */}
            <div className="text-right text-sm text-gray-500 font-medium pt-2 select-none">
              {wordCount}/{maxWords} words
            </div>
          </div>

          {/* 🌟 ส่วนล่าง: Metadata & ปุ่ม CREATE */}
          <div className="flex items-end justify-between pt-2">
            {/* รายละเอียด Topic / Writer / Date */}
            <div className="text-sm text-gray-600 flex flex-col gap-0.5 font-medium">
              <div>Topic : {topic_name}</div>
              <div>Group : {group_name}</div>
              <div>Writer : {username}</div>
              <div>Date : {currentDate}</div>
            </div>

            {/* ปุ่ม CREATE */}
            <button
              type="submit"
              className="bg-[#9E9E9E] hover:bg-[#8d8d8d] text-white font-bold px-8 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              CREATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;