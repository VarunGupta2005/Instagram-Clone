// src/components/Profile.jsx

import useGetProfile from '@/hooks/useGetProfile';
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './button';
import { Heart, MessageCircle, Bookmark, Lock } from 'lucide-react';
import FullPost from './FullPost.jsx';
import UserListDialog from './UserList.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../../redux/authSlice.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Step 1: Import axios
import { toast } from 'sonner'; // Step 2: Import toast

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const dispatch = useDispatch();
  const [showPost, setShowPost] = useState(false);
  const [reload, setReload] = useState(false);

  const { profile, loading } = useGetProfile(reload);

  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const { user, selectedProfile } = useSelector((store) => store.auth);
  console.log(user._id)

  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    users: [],
  });

  useEffect(() => {
    if (profile) {
      dispatch(setProfile(profile));
    }
  }, [profile, dispatch]);

  // Step 3: Implement the real follow/unfollow handler
  const handleFollowToggle = async () => {
    if (!selectedProfile?._id) {
      toast.error("User profile not available.");
      return;
    }
    try {
      // The same endpoint is used for both follow and unfollow
      let response;
      if (selectedProfile?.followers?.some(follower => follower._id === user._id)) {
        response = await axios.patch('http://localhost:3000/user/unfollow',
          { followedId: selectedProfile.username },
          { withCredentials: true }
        );
      }
      else {
        response = await axios.patch('http://localhost:3000/user/follow',
          { followedId: selectedProfile.username },
          { withCredentials: true })
      }

      if (response.data.success) {
        toast.success(response.data.message);

      } else {
        toast.error(response.data.message);
      }
      setReload(!reload);
    } catch (error) {
      toast.error("Error performing action");
      console.error("Error toggling follow:", error);
    }
  };

  if (loading) return <div className='flex justify-center items-center h-screen'><p>Loading...</p></div>;
  if (!profile) return <div className='flex justify-center items-center h-screen'><p>User not found.</p></div>;

  // Logic for a LOCKED profile
  if (selectedProfile?.isLocked) {
    return (
      <div className='container mx-auto max-w-4xl py-8'>
        {/* Profile Header for a LOCKED profile */}
        <div className='w-full px-4'>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16'>
            <Avatar className='w-24 h-24 md:w-36 md:h-36'>
              <AvatarImage src={selectedProfile.profilePicture} />
              <AvatarFallback>{selectedProfile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col items-center md:items-start gap-4'>
              <div className='flex flex-wrap items-center justify-center md:justify-start gap-4'>
                <div className='text-xl'>{selectedProfile.username}</div>
                {/* Step 4: The onClick handler now triggers the real API call */}
                <Button variant="default" size="sm" onClick={handleFollowToggle}>Follow</Button>
              </div>
              <div className='flex gap-4 md:gap-8 text-sm md:text-base'>
                <div><span className='font-semibold'>{selectedProfile.numPosts}</span> Posts</div>
                <div><span className='font-semibold'>{selectedProfile.followersCount}</span> Followers</div>
                <div><span className='font-semibold'>{selectedProfile.followingCount}</span> Following</div>
              </div>
              <div className='text-center md:text-left'>
                <div className='text-sm font-semibold'>{selectedProfile.bio || "No bio available."}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Private Account Notice */}
        <div className='flex flex-col items-center justify-center border-t mt-8 pt-10 gap-4'>
          <Lock className='w-12 h-12 text-gray-500' />
          <h3 className='text-xl font-bold'>This Account is Private</h3>
          <p className='text-gray-500'>Follow this account to see their photos and videos.</p>
        </div>
      </div>
    );
  }

  // Logic for UNLOCKED profiles
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPost(true);
  };
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };
  const handleFollowersClick = () => {
    if (selectedProfile?.followers?.length > 0) {
      setDialogState({ open: true, title: 'Followers', users: selectedProfile.followers });
    }
  };
  const handleFollowingClick = () => {
    if (selectedProfile?.following?.length > 0) {
      setDialogState({ open: true, title: 'Following', users: selectedProfile.following });
    }
  };
  const postsToDisplay = activeTab === 'posts' ? selectedProfile.posts : (selectedProfile.bookmarks || []);

  return (
    <div className='container mx-auto max-w-4xl py-8'>
      {/* Profile Header Section */}
      <div className='w-full px-4'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16'>
          <Avatar className='w-24 h-24 md:w-36 md:h-36'>
            <AvatarImage src={selectedProfile.profilePicture} />
            <AvatarFallback>{selectedProfile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col items-center md:items-start gap-4'>
            <div className='flex flex-wrap items-center justify-center md:justify-start gap-4'>
              <div className='text-xl'>{selectedProfile.username}</div>
              {selectedProfile.username !== user.username && (
                <div className='flex gap-2'>
                  {/* Step 5: This button now correctly triggers the API call */}
                  <Button variant="outline" size="sm" onClick={handleFollowToggle}>
                    {selectedProfile.followers.some(f => f._id === user._id) ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              )}
              {selectedProfile.username === user.username && (
                <div className='flex gap-2'>
                  <Button variant="outline" size="sm" onClick={handleEditProfile}>Edit Profile</Button>
                </div>
              )}
            </div>
            <div className='flex gap-4 md:gap-8 text-sm md:text-base'>
              <div><span className='font-semibold'>{selectedProfile.posts.length}</span> Posts</div>
              <div className='cursor-pointer' onClick={handleFollowersClick}>
                <span className='font-semibold'>{selectedProfile.followers.length}</span> Followers
              </div>
              <div className='cursor-pointer' onClick={handleFollowingClick}>
                <span className='font-semibold'>{selectedProfile.following.length}</span> Following
              </div>
            </div>
            <div className='text-center md:text-left'>
              <div className='text-sm font-semibold'>{selectedProfile.bio || "No bio available."}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Tabs Section */}
      <div className='flex items-center justify-center gap-10 md:gap-16 border-t mt-8 pt-4'>
        <div className={`text-sm font-semibold cursor-pointer pt-2 ${activeTab === 'posts' ? 'border-t-2 border-primary text-primary' : 'text-gray-500'}`} onClick={() => setActiveTab('posts')}>
          POSTS
        </div>
        {selectedProfile.username === user.username && (
          <div className={`text-sm font-semibold cursor-pointer pt-2 ${activeTab === 'bookmarks' ? 'border-t-2 border-primary text-primary' : 'text-gray-500'}`} onClick={() => setActiveTab('bookmarks')}>
            SAVED
          </div>
        )}
      </div>

      {/* Dynamic Posts Grid Section */}
      <div className='py-8 px-2'>
        {postsToDisplay.length > 0 ? (
          <div className='grid grid-cols-3 gap-1 sm:gap-4'>
            {postsToDisplay.map((post) => (
              <div key={post._id} className='relative aspect-square group cursor-pointer' onClick={() => handlePostClick(post)}>
                <img src={post.image} alt={`Post by ${profile.username}`} className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4'>
                  <div className='flex items-center gap-1 text-white font-bold'><Heart size={20} /><span>{post.likes.length}</span></div>
                  <div className='flex items-center gap-1 text-white font-bold'><MessageCircle size={20} /><span>{post.noOfComments}</span></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center mt-10 gap-4'>
            {activeTab === 'posts' ? (
              <><h3 className='text-xl font-bold'>No Posts Yet</h3><p className='text-gray-500'>This user hasn't shared any photos.</p></>
            ) : (
              <><Bookmark className='w-12 h-12 text-gray-400' /><h3 className='text-xl font-bold'>No Saved Posts</h3><p className='text-gray-500'>You haven't saved any posts yet.</p></>
            )}
          </div>
        )}
      </div>

      {/* Dialogs Rendering Section */}
      {showPost && selectedPost && (
        <FullPost post={selectedPost} setShow={setShowPost} showPost={showPost} />
      )}
      <UserListDialog
        open={dialogState.open}
        onOpenChange={(isOpen) => setDialogState({ ...dialogState, open: isOpen })}
        title={dialogState.title}
        users={dialogState.users}
      />
    </div>
  );
};

export { Profile };