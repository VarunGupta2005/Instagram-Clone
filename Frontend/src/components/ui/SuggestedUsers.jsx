import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "./avatar.jsx"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Link } from 'react-router-dom'; // Step 1: Import Link
import { setSuggestions } from '@/redux/authSlice.js';
import { useDispatch } from 'react-redux';

const SuggestedUsers = () => {
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  // Step 4 (Bug Fix): This function should accept the user's ID, not their username.
  const handleFollow = async (userId) => {
    try {
      // Pass the userId to the backend API call
      const response = await axios.patch('http://localhost:3000/user/follow', { followedId: userId }, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message);
        const updatedUserList = suggestedUsers.filter(sugg => sugg.username !== userId);
        dispatch(setSuggestions(updatedUserList));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  }

  return (
    <div name="container" className='flex flex-col gap-6 pt-9 w-[20%]'>
      {/* Step 2: Link to your own profile */}
      <Link to={`/profile/${user?.username}`} className='flex gap-4 items-center'>
        <Avatar className='w-12 h-12'>
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className='text-md font-semibold'>{user?.username}</h1>
          <p className='text-sm text-gray-400'> {user?.bio}</p>
        </div>
      </Link>

      <div className='flex justify-between items-center text-sm font-semibold'>
        <h1 className='text-gray-400'>Suggested for you</h1>
      </div>

      {suggestedUsers && suggestedUsers.map((sugg) => (
        <div key={sugg._id} className='flex justify-between items-center'>
          {/* Step 3: Link to the suggested user's profile */}
          <Link to={`/profile/${sugg.username}`} className='flex gap-2 items-center'>
            <Avatar className='w-10 h-10'>
              <AvatarImage src={sugg.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex flex-col text-sm'>
              <span className='font-bold'>{sugg.username}</span>
              <span className='text-xs text-gray-400'>{sugg.bio}</span>
            </div>
          </Link>
          {/* The follow button remains separate from the link */}
          <p
            className='text-xs font-bold text-blue-400 cursor-pointer'
            onClick={() => handleFollow(sugg.username)} // Pass the user's ID
          >
            Follow
          </p>
        </div>
      ))}
    </div>
  )
}

export default SuggestedUsers;