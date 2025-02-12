import { useAppStore } from "@/store"
import { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar,AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/utils";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE,HOST, REMOVE_PROFILE_IMAGE_ROUTE } from "@/utils/constants";

export default function Profile() {
  const navigate=useNavigate();
  const {userInfo,setUserInfo}=useAppStore();
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [image,setImage]=useState(null);
  const [hovered,setHovered]=useState(false);
  const [selectedColor,setSelectedColor]=useState(0);
  const fileInputRef = useRef(null);

  useEffect(()=>{
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if(userInfo.image){
      setImage(userInfo.image);
    }
  },[userInfo])
  
  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is Required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is Required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            color: selectedColor,
          },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile Updated Successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleImageChange = async (event)=>{
    const file = event.target.files[0];
    if(file){
      const formData = new FormData();
      formData.append("profile-image", file);
      const response=apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true});
      if(response.status==200 && response.data.image){
        setUserInfo({...userInfo,image:(await response).data.image});
        toast.success("Image updated successfully.");
      }
      const reader=new FileReader();
      reader.onload=()=>{
        setImage(reader.result);
      }
      reader.readAsDataURL(file);

    }
  }
  const handleDeleteImage = async ()=>{
    try{
      const response=await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{withCredentials:true});
      if(response.status===200){
        setUserInfo({...userInfo,image:null});
        toast.success("Profile image removed successfully.");
        setImage(null);
      }

    }catch(err){
      console.log(err);
    }
  }
  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };
  const handleNavigate=()=>{
    if(userInfo.profileSetup){
      navigate("/chat");
    }
    else{
      toast.error("Please setup Profile");
    }
  }

  return (<div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
    <div className="flex flex-col gap-10 w-[80vw] md:w-max">
    <div className="">
          <IoArrowBack
            className="text-4xl lg:text-6xl text-white text-opacity-90 cursor-pointer"
            onClick={handleNavigate}
          />
        </div>
        <div className=" grid grid-cols-2">
        <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48  rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48  text-5xl bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              accept=".png, .jpg, .jpeg, .svg, .webp"
              name="profile-image"
            /> 
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
          <div className="w-full">
            <Input
             placeholder="First Name"
             type="text"
             className="rounded-lg p-6 bg-[#2c2e3b] border-none"
             value={firstName}
             onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="w-full flex gap-5">
            {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-100 ${
                    selectedColor === index
                      ? " outline outline-white outlin4"
                      : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      <div className="w-full">
        <Button
        className="h-16 w-full bg-[#5d5d64] hover:bg-[#424247] transition-all duration-300"
        onClick={saveChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  </div>
  );
};


