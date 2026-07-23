import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// 1. Import Type ที่เราสร้างไว้ใน Type.dropdown.ts เข้ามาใช้งาน
import type { DropdownProps, DropdownOption } from "../Types/dropdown.types";

// 2. นำ DropdownProps มาระบุชนิดข้อมูลให้กับ Component
const SmoothDropdown: React.FC<DropdownProps> = ({ options, onSelectOption }) => {
  // State สำหรับเปิด/ปิด Dropdown
  const [isOpen, setIsOpen] = useState(false); 
  // State สำหรับเก็บ Option ที่กำลังถูกเลือก
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);

  // ฟังก์ชันทำงานเมื่อมีการกดเลือกตัวเลือก
  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    setIsOpen(false); // ปิด Dropdown
    onSelectOption(option); // ส่งข้อมูล Option ที่ถูกเลือกกลับไปให้หน้าแม่ (Parent)
  };

  return (
    <div className="relative w-full max-w-[650px] px-6">
      {/* ตัวกล่อง Dropdown หลัก */}
      <div
        className={`w-full bg-[#E2E2E2] text-black text-xl shadow-inner transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'rounded-[28px]' : 'rounded-full'
        }`}
      >
        {/* ปุ่มกดเปิด/ปิด Dropdown */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-4 pl-8 pr-16 flex items-center justify-between text-left focus:outline-none relative cursor-pointer"
        >
          <span className={selectedOption ? 'text-black font-medium' : 'text-gray-500'}>
            {/* ดึง topic_name มาแสดงผล ถ้ายังไม่ได้เลือกให้โชว์ข้อความเริ่มต้น */}
            {selectedOption ? selectedOption.topic_name : 'Select a topic...'}
          </span>

          {/* ไอคอนลูกศรหมุนกลับหัวตอนเปิด */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <ChevronDown
              className={`h-7 w-7 text-gray-700 transition-transform duration-300 ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
              strokeWidth={2.5}
            />
          </div>
        </button>

        {/* เมนูรายการตัวเลือกที่จะยืดลงมาแบบ Smooth */}
        <div
          className={`transition-all duration-300 ease-in-out grid ${
            isOpen ? 'grid-rows-[1fr] opacity-100 pb-3' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden flex flex-col">
            {options.map((option) => (
              <button
                key={option.topic_id}
                type="button"
                onClick={() => handleSelect(option)}
                /* 
                   🎨 เรื่อง hover สีเปลี่ยน: 
                   ใช้อย่าง hover:bg-gray-300/80 และ hover:text-blue-600 
                   เปลี่ยนสีอัตโนมัติเมื่อเมาส์ไปชี้โดยไม่ต้องใส่ใน Type ครับ
                */
                className="w-full text-left py-3 pl-8 pr-16 text-lg text-black hover:bg-gray-300/80 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
              >
                {option.topic_name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmoothDropdown;