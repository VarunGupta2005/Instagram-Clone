import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Bookmark, MessageCircle, Send } from 'lucide-react'
import Comment from './Comment.jsx';
import { useState } from 'react';
const PostFrame = () => {
  const [text, setText] = useState("");
  const [showComment, setShowComment] = useState(false);
  const onInputChange = (e) => {
    const input = e.target.value;
    if (input.trim())
      setText(input);
  }
  return (
    <div className='w-full max-w-lg rounded-md p-4 flex flex-col gap-2 mt-2'>
      <div>
        <div className='flex gap-2 items-center mb-0.5 '><Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
          <p>Username</p></div>
      </div>
      <div>
        <img src="https://burst.shopifycdn.com/photos/person-stands-on-rocks-poking-out-of-the-ocean-shoreline.jpg?width=1000&format=pjpg&exif=0&iptc=0" className='rounded-sm aspect-square object-cover h-full' alt=''></img>
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-3.5 mt-2 ml-1'>
          <FaRegHeart className='w-6 h-6' />
          <MessageCircle onClick={() => {
            setShowComment(true);
          }} className='w-6 h-6 cursor-pointer hover:text-gray-600' />
          <Send className='w-6 h-6 cursor-pointer hover:text-gray-600' />
        </div>
        <div className='w-6 h-6 cursor-pointer hover:text-gray-600'><Bookmark /></div>
      </div>
      <div className='flex flex-col gap-1 text-sm'>
        <span>123456 likes</span>
        <p>
          <span>Username </span>
          <span>Caption</span>
        </p>
        <span className='cursor-pointer' onClick={() => {
          setShowComment(true);
        }}>View all comments</span>
      </div>
      <Comment setDialog={setShowComment} showComment={showComment} />
      <div className='flex custom-scrollbar justify-between gap-2'>
        <textarea type="text"
          placeholder='Add a comment...'
          value={text}
          onChange={onInputChange}
          className='w-full h-7 resize-none  overflow-y-auto  text-sm focus:outline-none' />
        {
          text && <button className='text-blue-500 cursor-pointer'>Post</button>
        }
      </div>
    </div >
  )
}

export default PostFrame
