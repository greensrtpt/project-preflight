import type { CreatePostClicked } from "../Types/Modal.types"

const CreateNewPost: React.FC<CreatePostClicked> = ({onClick}) => {
    return(
    <div
        className="bg-[#D9D9D9] hover:bg-[#cfcfcf] py-6 px-6 rounded-3xl transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md"
        onClick={onClick}
        >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="text-4xl text-black font-light leading-none mb-1">+</span>
            </div>
            <span className="text-xl font-bold text-gray-900 text-center">Create new post</span>
    </div>
    )
}

export default CreateNewPost