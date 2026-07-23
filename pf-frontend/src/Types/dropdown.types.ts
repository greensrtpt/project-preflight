// 1. หน้าตาของ 1 Option
export interface DropdownOption {
  topic_id: string | number; // เก็บ ID หรือ Path หน้าที่จะเปลี่ยนไป
  topic_name: string;        // ชื่อข้อความที่จะโชว์บนหน้าจอ
}

// 2. Props ที่ Component Dropdown รับเข้ามา
export interface DropdownProps {
  options: DropdownOption[];
  // เมื่อ User คลิกเลือก ให้ส่ง Option ตัวที่โดนคลิกกลับออกไป
  onSelectOption: (option: DropdownOption) => void; 
}