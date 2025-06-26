// src/components/UserListDialog.jsx
import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './button';
import axios from 'axios';
import { toast } from 'sonner';
import { setProfile, setUser } from '../../redux/authSlice.js';

const UserListDialog = ({ open, onOpenChange, title, users = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser, selectedProfile } = useSelector((store) => store.auth);

  // 2. Add local state to manage the list of users being displayed.
  const [displayedUsers, setDisplayedUsers] = useState(users);
  const [loadingUserUsername, setLoadingUserUsername] = useState(null);

  // 3. Use useEffect to keep the local state in sync with the incoming 'users' prop.
  // This is crucial for when the dialog is re-opened with a different list.
  useEffect(() => {
    setDisplayedUsers(users);
  }, [users]);

  const handleUserClick = (username) => {
    onOpenChange(false);
    navigate(`/profile/${username}`);
  };

  const handleAction = async (targetUser) => {
    setLoadingUserUsername(targetUser.username);
    try {
      let response;
      if (title === 'Following') {
        response = await axios.patch(
          'http://localhost:3000/user/unfollow',
          { followedId: targetUser.username },
          { withCredentials: true }
        );

        if (response.data.message) {
          toast.success("Unfollowed successfully");
          // Update global Redux state

          const updatedSelectedProfile = {
            ...selectedProfile,
            following: selectedProfile.following.filter(user => user._id !== targetUser._id),
          };
          dispatch(setProfile(updatedSelectedProfile));

          // --- 4. UPDATE LOCAL STATE FOR IMMEDIATE UI CHANGE ---
          setDisplayedUsers(currentList => currentList.filter(u => u._id !== targetUser._id));
        }
      }
      else if (title === 'Followers' && currentUser.username === selectedProfile.username) {
        response = await axios.patch(
          'http://localhost:3000/user/removeFollower',
          { followerId: targetUser.username },
          { withCredentials: true }
        );
        if (response.data.message) {
          toast.success("Follower removed successfully");
          // Update global Redux state
          const updatedSelectedProfile = {
            ...selectedProfile,
            followers: selectedProfile.followers.filter(user => user._id !== targetUser._id),
          };
          dispatch(setProfile(updatedSelectedProfile));

          // --- 4. UPDATE LOCAL STATE FOR IMMEDIATE UI CHANGE ---
          setDisplayedUsers(currentList => currentList.filter(u => u._id !== targetUser._id));
        }
      }
    } catch (err) {
      console.error("Error performing action:", err);
      toast.error(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoadingUserUsername(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center p-4">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4 px-4 overflow-y-auto">
          {/* 5. Render from the local state variable 'displayedUsers' */}
          {displayedUsers.length > 0 ? (
            displayedUsers.map((user) => (
              <div key={user.username} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-grow overflow-hidden">
                  <div className="cursor-pointer" onClick={() => handleUserClick(user.username)}>
                    <Avatar>
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col truncate">
                    <span
                      className="font-semibold text-sm cursor-pointer truncate"
                      onClick={() => handleUserClick(user.username)}
                    >
                      {user.username}
                    </span>
                    <span className="text-xs text-gray-500 truncate">{user.bio || 'No bio'}</span>
                  </div>
                </div>

                {currentUser.username === selectedProfile.username && user.username !== currentUser.username && (
                  <Button
                    variant="outline"
                    size="sm"
                    className=" flex-shrink-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onClick={() => handleAction(user)}
                    disabled={loadingUserUsername === user.username}
                  >
                    {loadingUserUsername === user.username ? "..." : (title === 'Followers' ? "Remove" : "Unfollow")}
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">No users to display.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserListDialog;