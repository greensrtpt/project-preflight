import type { CreateGroupClicked } from "../../Types/Modal.types";

const CreateNewGroup: React.FC<CreateGroupClicked> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#FFD27E] hover:bg-[#FFC960] aspect-square rounded-[36px] border-[2.5px] border-[#626161] p-5 shadow-sm transition-all duration-200 flex flex-col items-center justify-between cursor-pointer select-none"
    >
      {/* Spacer ด้านบนถ่วงน้ำหนัก */}
      <div className="w-full h-1" />

      {/* 🌟 วงกลมสีม่วงขนาดใหญ่ (w-28 h-28 ถึง w-32 h-32) */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#B89AFE] border-[2.5px] border-[#626161] flex items-center justify-center">
        {/* เครื่องหมาย + ตัวใหญ่และหนา */}
        <span className="text-5xl sm:text-6xl text-[#626161] font-bold leading-none mb-1">
          +
        </span>
      </div>

      {/* ข้อความด้านล่าง */}
      <span className="text-xl font-bold text-[#626161] text-center">
        Create new group
      </span>
    </div>
  );
};

export default CreateNewGroup;