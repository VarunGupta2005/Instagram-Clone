import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './dialog.jsx';
import axios from 'axios';
import { Button } from './button.jsx';
import { Avatar, AvatarImage, AvatarFallback } from "./avatar.jsx";
import { toast } from 'sonner';

const Notifications = ({ setShowNots, showNots, user }) => {
  const [reqs, setReqs] = useState([]);

  const [loadingUsername, setLoadingUsername] = useState(null);

  const getFollowRequests = async () => {
    try {
      const response = await axios.get('https://chat-app-m37n.onrender.com/user/getRequests', { withCredentials: true });
      if (response.data.success) {
        setReqs(response.data.followRequests);
      } else {
        console.error('Failed to fetch follow requests:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching follow requests:', error);
    }
  };

  useEffect(() => {
    if (showNots && user) {
      getFollowRequests();
    }
  }, [showNots, user]);

  const handleReq = async (status, username) => {

    setLoadingUsername(username);
    try {
      const response = await axios.patch('https://chat-app-m37n.onrender.com/user/handleRequest', { followerId: username, status: status }, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message);


        setReqs(currentRequests =>
          currentRequests.filter(req => req.username !== username)
        );

      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Error processing request');
    } finally {
      setLoadingUsername(null);
    }
  };

  return (
    <Dialog open={showNots} onOpenChange={setShowNots}>
      <DialogContent className="w-[90vw] sm:w-[500px] outline-none">
        <div className="flex flex-col gap-4 justify-center pl-3 pr-3 pb-3">
          <h1 className="text-lg font-semibold border-b pb-3 text-center pt-3">Follow Requests</h1>

          {reqs && reqs.length > 0 ? (
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
              {reqs.map((request) => (
                <div key={request._id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={request.profilePicture} alt={request.username} />
                      <AvatarFallback>{request.username ? request.username.slice(0, 2).toUpperCase() : '??'}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{request.username}</p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleReq(true, request.username)}
                      size="sm"
                      disabled={loadingUsername === request.username}
                    >
                      {loadingUsername === request.username ? '...' : 'Accept'}
                    </Button>
                    <Button
                      onClick={() => handleReq(false, request.username)}
                      variant="outline"
                      size="sm"
                      disabled={loadingUsername === request.username}
                    >
                      {loadingUsername === request.username ? '...' : 'Decline'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No new follow requests.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Notifications;