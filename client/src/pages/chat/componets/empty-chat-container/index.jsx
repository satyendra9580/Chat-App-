import Lottie from "react-lottie";
import {animationDefaultOptions} from "@/lib/utils"
function EmptyChatContainer() {
  return (
    <div className="flex-1 md:bg-[#19191f] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
        <Lottie 
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
        />
        <div className="text-opacity-80 text-gray-400 flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
            <h3 className="poppins-medium">
                Hi<span className="">!</span> Welcome to
                <span className="text-gray-200"> ChatSphere</span> App
                <span className="">.</span>
            </h3>
        </div>
        </div>
  )
}

export default EmptyChatContainer;