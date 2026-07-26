import SmoothDropdown from '../components/SmoothDropdown';
import type { DropdownOption } from '../Types/dropdown.types';
import { useNavigate } from 'react-router-dom';
import React from "react";
import LogInButton from '../components/LogInButton';

const Searchpage: React.FC = () => {
  const navigate = useNavigate();
  // 1. เตรียมข้อมูล Options (ต้องมี topic_id และ topic_name ตรงตาม Interface)
  const topicList: DropdownOption[] = [
    { topic_id: '3d5b36cf-67b7-46cc-8ee6-0025ba9a0e23', topic_name: 'กิจกรรม' },
    { topic_id: '98178014-d4ec-4f7e-80e3-67f448ec6ae9', topic_name: 'การเรียน' },
    { topic_id: '2152929b-fb88-4425-b311-0ce09604e76c', topic_name: 'ชีวิตใน มช' },
  ];

  // 2. สร้างฟังก์ชันรับค่าเมื่อ User คลิกเลือก
  const handleSelectTopic = async (selectedOption: DropdownOption) => {
    console.log('User chooses topic ID:', selectedOption.topic_id);
    console.log('User chooses topic name:', selectedOption.topic_name);
    navigate(`/showAllGroup/${selectedOption.topic_id}`);
    // finally {
    //   setLoading(false);
    // }
  };
  
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ส่วนหัว (Header) */}
      <header className="flex justify-end p-6 md:p-8">
        <LogInButton></LogInButton>
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