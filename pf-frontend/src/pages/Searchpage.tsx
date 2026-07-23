import React, { useState } from 'react';
import SmoothDropdown from '../components/SmoothDropdown';
import type { DropdownOption } from '../Types/dropdown.types';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import type {DataFromTopic} from "../Types/APIresultFromSearchPage.types"

const Searchpage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [Data,setData] = useState<DataFromTopic|null>(null)
  // const [Loading, setLoading] = useState<boolean>(false);

  // 1. เตรียมข้อมูล Options (ต้องมี topic_id และ topic_name ตรงตาม Interface)
  const topicList: DropdownOption[] = [
    { topic_id: '996c5d4e-2fb3-4436-bfbf-00c65e62685c', topic_name: 'activities' },
    { topic_id: '965b6a4c-b18e-41f9-b824-34dbec8ec82a', topic_name: 'study' },
    { topic_id: '42fa09c9-2f6a-44e6-9236-6e1905a6d047', topic_name: 'university life' },
  ];

  // 2. สร้างฟังก์ชันรับค่าเมื่อ User คลิกเลือก
  const handleSelectTopic = async (selectedOption: DropdownOption) => {
    console.log('User chooses topic ID:', selectedOption.topic_id);
    console.log('User chooses topic name:', selectedOption.topic_name);
    try{
    const res = await fetch('http://localhost:3001/topics/'+selectedOption.topic_id);
          const resultTopic = await res.json();
          setData(resultTopic);
    } catch (error) {
      console.error('something went wrong with API:', error);
    } 
    // finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ส่วนหัว (Header) */}
      <header className="flex justify-end p-6 md:p-8">
        <Link to="/login" className="bg-[#E2E2E2] hover:bg-gray-300 text-black text-lg font-medium px-8 py-2.5 rounded-full shadow-sm transition duration-150">
          log in
        </Link>
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