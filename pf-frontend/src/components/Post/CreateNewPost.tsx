import type { CreatePostClicked } from "../../Types/Modal.types"

const CreateNewPost: React.FC<CreatePostClicked> = ({onClick}) => {
    return(
    <div
        className="bg-[#FFD27E] hover:bg-[#FFBF48] py-6 px-6 rounded-3xl transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md border-2 border-[#626161]"
        onClick={onClick}
        >
            <div className="w-16 h-16 rounded-full bg-[#B89AFE] flex items-center justify-center shadow-sm border-2 border-[#626161]">
              <span className="text-4xl text-black font-light leading-none mb-1">+</span>
            </div>
            <span className="text-xl font-bold text-[#626161] text-center">Create new post</span>
    </div>
    )
}

export default CreateNewPost