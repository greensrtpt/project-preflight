import React, { useState } from 'react';
import type { EditGroupCardProps } from '../../Types/Modal.types';
import { authStorage } from '../../utils/storage.ts';

export const EditGroupCard: React.FC<EditGroupCardProps> = ({
  onSubmit,
  onCancel,
  group_id,
  topic_id,
  old_groupname,
}) => {
  const [groupName, setGroupName] = useState(old_groupname);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim() || isSubmitting) {
      alert('Please fill group name');
      return;
    }

    const token = authStorage.getToken();
    if (!token) {
      alert('Please Login before Edit group');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/groups/${topic_id}/${group_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          group_name: groupName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Cannot Edit group');
        return;
      }

      alert('Edit group successful!');
      
      if (onSubmit) {
        await onSubmit(groupName.trim());
      }
    } catch (err) {
      console.error('Edit Group Error:', err);
      alert('Cannot connect to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleEdit}
      className="bg-[#D1C2FF] aspect-square rounded-[36px] border-[2.5px] border-black p-6 shadow-sm flex flex-col justify-between select-none relative animate-fade-in"
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
          className="w-full bg-transparent border-b-2 border-black/40 focus:border-black outline-none px-1 py-1 text-lg text-black font-semibold placeholder:text-gray-500 transition-colors"
        />
      </div>

      {/* ส่วนปุ่มกดด้านล่าง */}
      <div className="flex justify-end gap-2 items-center">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-bold text-[#626161] hover:text-red-600 transition-colors"
        >
          Cancel
        </button>

        {/* ปุ่ม UPDATE สีเขียว */}
        <button
          type="submit"
          disabled={!groupName.trim() || isSubmitting}
          className={`border-[2.5px] border-black font-extrabold px-6 py-2.5 rounded-2xl transition-all shadow-sm ${
            groupName.trim() && !isSubmitting
              ? 'bg-[#63BF52] hover:bg-[#45B331] text-white cursor-pointer active:scale-95'
              : 'bg-gray-400 text-gray-200 opacity-60 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? '...' : 'UPDATE'}
        </button>
      </div>
    </form>
  );
};