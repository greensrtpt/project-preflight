import LogInButton from "./LogInButton";
import type { HeaderProps } from "../Types/Header.types";

const Header: React.FC<HeaderProps> = ({onClickBack,showName,placeholder}) => {
    return(
<div className="fixed w-full h-[130px] bg-gray-50 top-0 z-50">
             <header className="flex justify-end">
                <LogInButton></LogInButton>
              </header>
        {/* แสดงชื่อ Topic */}
        <div className="fixed top-11 left-10">
        <div className="flex items-start gap-3 text-black hover:text-gray-600 transition-colors"
        onClick={onClickBack}>
    <svg 
      className="w-8 h-8 md:w-10 md:h-10 stroke-current stroke-[3]" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15 19l-7-7 7-7" 
      />
    </svg>
    <div className="fixed top-11 left-25">
        <h1 className="text-4xl font-bold text-black mb-8 capitalize ">
          {showName || placeholder}
        </h1>
     </div>   
        </div> </div>
        </div>
    )
}

export default Header;