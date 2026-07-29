import React, { useState } from 'react';
import type { CreateGroupCardProps } from '../../Types/Modal.types';
import { authStorage } from '../../utils/storage.ts';

export const CreateGroupCard: React.FC<CreateGroupCardProps> = ({ onCancel,
  topic_id}) => {
  const [groupName, setGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || isSubmitting){
        alert('Please fill group name');
        return;
    }
    const token = authStorage.getToken();
    
    if (!token) {
    alert('Please Login before create group');
    return;
    }

try {
    setIsSubmitting(true);
            const response = await fetch(`http://localhost:3001/groups/${topic_id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
                body: JSON.stringify({
                      topic_id:topic_id,
                      group_name: groupName,
                      owner_id:authStorage.getUserId(),
                      owner_name:authStorage.getUsername(),
              }),
            });
            const data = await response.json();
    
            if (!response.ok) {
              alert(data.message || "Cannot create group");
              return;
            }
    
             setGroupName('');
             alert("Create group successful!");
             window.location.reload();
      
            }catch(err){
      console.error("Login Error:", err);
      alert("Cannot connect to server. Please try again.");
      return;
            } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleCreate}
      className="bg-[#D1C2FF] aspect-square rounded-[36px] border-[2.5px] border-[#626161] p-6 shadow-sm flex flex-col justify-between select-none relative animate-fade-in"
    >
      {/* ส่วนกรอกชื่อกลุ่มด้านบน */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-xl font-bold text-black pl-1">Name</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name..."
          maxLength={100}
          autoFocus
          className="w-full bg-transparent border-b-2 border-[#626161] outline-none px-1 py-1 text-lg text-black font-semibold placeholder:text-[#626161] transition-colors"
        />
      </div>

      {/* ส่วนปุ่มกดด้านล่าง */}
      <div className="flex justify-end gap-2 items-center">
        {/* ปุ่มยกเลิก (ถ้าเปลี่ยนใจไม่สร้าง) */}
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-bold text-[#626161] hover:text-red-600 transition-colors"
        >
          Cancel
        </button>

        {/* ปุ่ม CREATE สีเขียวเหมือนในรูป */}
        <button
          type="submit"
          disabled={!groupName.trim() || isSubmitting}
          className={`border-[2.5px] border-[#626161] font-extrabold px-6 py-2.5 rounded-2xl transition-all shadow-sm ${
            groupName.trim() && !isSubmitting
              ? 'bg-[#63BF52] hover:bg-[#45B331] text-white cursor-pointer active:scale-95'
              : 'bg-gray-400 text-gray-200 opacity-60 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? '...' : 'CREATE'}
        </button>
      </div>
    </form>
  );
};