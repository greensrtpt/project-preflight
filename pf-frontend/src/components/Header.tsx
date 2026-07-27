import LogInButton from "./LogInButton";
import type { HeaderProps } from "../Types/Header.types";
import bgHeader from "../assets/bgHeader.png";

const Header: React.FC<HeaderProps> = ({onClickBack,showName,placeholder}) => {
    return(
<div className="absolute top-0 left-0 w-full h-[130px] top-0 z-50 px-8">
  <img 
        src={bgHeader} 
        alt="Header Background" 
        className="absolute inset-0 w-full h-full object-cover object-center -z-10"
      />
             <header className="flex justify-end">
                <LogInButton></LogInButton>
              </header>
        {/* แสดงชื่อ Topic */}
        <div className="fixed top-11 left-10">
        <div className="flex items-start gap-3 text-[#626161] hover:text-[#C39AF6] transition-colors"
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
        <h1 className="text-4xl font-bold text-[#626161] mb-8 capitalize ">
          {showName || placeholder}
        </h1>
     </div>   
        </div> </div>
        </div>
    )
}

export default Header;