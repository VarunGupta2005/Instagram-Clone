import React from 'react'
import { Heart, Home, LogOut, MessageCircle, Search, TrendingUp, PlusSquare } from 'lucide-react'
import profileIcon from '../../assets/profile.svg'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useTheme } from './provideTheme.jsx';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/authSlice.js'
import { CreatePost } from './createPost.jsx'
import { useState } from 'react';
import { setPosts } from '../../redux/postSlice.js'
import { FaSquareInstagram } from 'react-icons/fa6';
import Notifications from './Notifications.jsx'
import { FaRegMoon } from 'react-icons/fa';
import { AiFillSun } from 'react-icons/ai';
const SideBar = () => {
  const { user } = useSelector(store => store.auth);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showCreate, setShowCreate] = useState(false);
  const [showNots, setShowNots] = useState(false);
  const Items = [
    {
      name: "Home",
      icon: <Home />
    },
    {
      name: "Search",
      icon: <Search />
    },

    {
      name: "Messages",
      icon: <MessageCircle />
    },
    {
      name: "Notifications",
      icon: <Heart />
    },
    {
      name: "Create",
      icon: <PlusSquare />
    },
    {
      name: "Profile",
      icon: (
        <Avatar className="w-7 h-7">
          <AvatarImage src={user?.profilePicture} className="dark:bg-white dark:text-white" />
          <AvatarFallback></AvatarFallback>
        </Avatar>

      )
    },
    {
      name: "Logout",
      icon: <LogOut />
    }
  ]
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogOut = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user/signout", {
        withCredentials: true
      })
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(null));
        dispatch(setPosts([]));
        navigate("/signin")
      }
      else {
        toast.error(res.data.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error("Error in logging out");

    }
  }
  const handleHome = () => {
    navigate("/");
  }
  const handleProfile = () => {
    navigate(`/profile/${user.username}`);
  }
  const handleCreate = () => {
    setShowCreate(true);
  }
  const handleNots = () => {
    setShowNots(!showNots);
  }
  const handleSideBar = (item) => {
    if (item.name === "Logout") {
      handleLogOut();
    }
    else if (item.name === "Create") {
      handleCreate();
    }
    else if (item.name === "Profile") {
      handleProfile();
    }
    else if (item.name === "Home") {
      handleHome();
    }
    else if (item.name === "Notifications") {
      handleNots();
    }
    else if (item.name === "Search") {
      navigate("/search");
    }
    else if (item.name === "Messages") {
      navigate("/messages");
    }
  }
  return (
    <div className='dark:text-white w-[16%] border-r border-gray-300 dark:border-[#1e1e1e] dark:border-[3px] h-screen flex flex-col gap-4'>
      <div className="pl-4 flex items-center gap-2 p-2    rounded-md  relative pt-4">
        <FaSquareInstagram className='w-7 h-7' />
        <h1 className='text-lg font-bold' >InstaGram</h1>
      </div>

      {
        Items.map((item, index) => (
          <div onClick={() => handleSideBar(item)} key={index} className="pl-4 flex items-center gap-2 p-2  hover:bg-gray-200 dark:hover:bg-[#1e1e1e]  rounded-md cursor-pointer relative">
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </div>
        ))
      }
      <div onClick={toggleDarkMode} className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-[#1e1e1e] rounded-md cursor-pointer mt-auto mb-4">

        {isDarkMode ? (<div className="pl-4 flex items-center gap-2 p-2  hover:bg-gray-200 dark:hover:bg-[#1e1e1e]  rounded-md cursor-pointer relative">
          <FaRegMoon className='w-4 h-4' />
          <h1 className='text-sm' >Light Mode</h1>
        </div>) : (<div className="pl-4 flex items-center gap-2 p-2  hover:bg-gray-200 dark:hover:bg-[#1e1e1e]  rounded-md cursor-pointer relative ">
          <AiFillSun className='w-4 h-4' />
          <h1 className='text-sm' >Dark Mode</h1>
        </div>)}
      </div>
      {showCreate && <CreatePost showCreate={showCreate} setShowCreate={setShowCreate} user={user} />}
      {showNots && <Notifications showNots={showNots} setShowNots={setShowNots} user={user} />}

    </div >

  )
}

export { SideBar }
