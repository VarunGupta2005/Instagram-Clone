import React from 'react'
import { Heart, Home, LogOut, MessageCircle, Search, TrendingUp } from 'lucide-react'
import profileIcon from '../../assets/profile.svg'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useTheme } from './provideTheme.jsx';

const Items = [
  {
    name: "Home",
    icon: <Home/>
  },
  {
    name: "Search",
    icon: <Search/>
  },
  {
    name: "Explore",
    icon: <TrendingUp/>
  },
  {
    name: "Messages",
    icon: <MessageCircle/>
  },
  {
    name: "Notifications",
    icon: <Heart/>
  },
  {
    name: "Profile",
  icon: (
    <Avatar className="w-7 h-7">
  <AvatarImage src={profileIcon} className="dark:bg-white dark:text-white" />
  <AvatarFallback></AvatarFallback>
</Avatar>

  )
  },
  {
    name: "Logout",
    icon: <LogOut/>
  }
]
const SideBar = () => {
const { isDarkMode, toggleDarkMode } = useTheme();

  const navigate = useNavigate();
  const handleLogOut = async()=>{
    try{
      const res = await axios.get("http://localhost:3000/user/signout",{
        withCredentials:true
      })
      if(res.data.success){
        toast.success(res.data.message);
        navigate("/signin")
      }
      else{
        toast.error(res.data.message);
      }
    }catch(error){
      // console.log(error);
      toast.error("Error in logging out");

    }
  }
  const handleSideBar = (item) => {
    if(item.name === "Logout"){
      handleLogOut();
    }else{
      // navigate(`/${item.name.toLowerCase()}`);
    }
  }
  return (
    <div className='dark:text-white w-[13%] border-r border-gray-300 dark:border-[#1e1e1e] dark:border-[3px] h-screen flex flex-col gap-4'>
      <h1 className='p-2 text-sm'>InstaGram</h1>
      {
        Items.map((item, index) => (
          <div onClick = {()=>handleSideBar(item)}key={index} className="flex items-center gap-2 p-2  hover:bg-gray-200 dark:hover:bg-[#1e1e1e]  rounded-md cursor-pointer relative">
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </div>
        ))
      }
      <div onClick={toggleDarkMode} className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-[#1e1e1e] rounded-md cursor-pointer mt-auto mb-4">
        
        <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </div>
    </div>
  )
}

export  {SideBar}
