import React, { useState } from 'react';
import type {CreatePostModalProps} from '../../Types/Modal.types.ts'
import { authStorage } from '../../utils/storage.ts';

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
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
        const response = await fetch(`/api/posts/${group_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
            body: JSON.stringify({
            group_id:group_id,
            title: title,
            descriptions: description,
            author_id:authStorage.getUserId,
            author_name:authStorage.getUsername,
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
  const currentDate = new Date().toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit' 
  });

  const username = authStorage.getUsername();

  return (
    /* Background Overlay */
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      {/* Modal Card Container */}
      <div className="relative bg-[#FFFCFC] w-full max-w-2xl rounded-3xl p-8 shadow-xl flex flex-col gap-4 border-2 border-[#626161]">
        
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
              className="w-full bg-[#D7C8DD] text-2xl font-bold placeholder-black/40 text-black px-4 py-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* 🌟 ช่องกรอก Description พร้อม Word Counter */}
          <div className="relative flex flex-col h-72">
            <textarea
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full flex-1 bg-[#D7C8DD] rounded-xl p-4 resize-none text-base text-black placeholder-black/40 border-none focus:outline-none focus:ring-2 focus:ring-gray-400"/>
            {/* ตัวนับจำนวนคำด้านขวาล่าง */}
            <div className="text-right text-sm text-[#626161] font-medium pt-2 select-none">
              {wordCount}/{maxWords} words
            </div>
          </div>

          {/* 🌟 ส่วนล่าง: Metadata & ปุ่ม CREATE */}
          <div className="flex items-end justify-between pt-2">
            {/* รายละเอียด Topic / Writer / Date */}
            <div className="text-sm text-[#626161] flex flex-col gap-0.5 font-medium">
              <div>Topic : {topic_name}</div>
              <div>Group : {group_name}</div>
              <div>Writer : {username}</div>
              <div>Date : {currentDate}</div>
            </div>

            {/* ปุ่ม CREATE */}
            <button
               type="submit"
               disabled={!title}
               className={`border-2 border-[#626161] font-bold px-8 py-2.5 rounded-xl transition-colors shadow-sm ${
                title 
               ? 'bg-[#63BF52] hover:bg-[#45B331] text-white cursor-pointer' 
               : 'bg-gray-400 text-gray-200 opacity-50 cursor-not-allowed'
            }`}
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