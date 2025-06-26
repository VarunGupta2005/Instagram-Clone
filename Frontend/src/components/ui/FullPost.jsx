import React, { useEffect, useState } from 'react';
// DialogTrigger has been removed from imports
import { Dialog, DialogContent } from "./dialog.jsx";
import { Avatar, AvatarImage, AvatarFallback } from './avatar.jsx';
// MoreHorizontal has been removed from imports
import { Heart, Bookmark, MessageCircle, Send } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile, setUser } from '../../redux/authSlice.js';

const FullPost = ({ showPost, setShow, post }) => {
  const [text, setText] = useState("");
  const onInputChange = (e) => {
    setText(e.target.value);
  }
  const dispatch = useDispatch();
  const { user, selectedProfile } = useSelector((store) => store.auth);
  const postId = post?._id;
  const [comments, setComments] = useState([]);
  const [temp, setTemp] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user && post) {
      setIsLiked(post.likes.includes(user._id));
      setIsSaved(user.bookmarks.includes(post._id));
      setLikeCount(post.likes.length);
    }
  }, [user, post]);

  const likeDislike = async () => {
    try {
      const response = await axios.post('http://localhost:3000/userPost/React', { postId }, { withCredentials: true });
      if (response.data.success) {
        const newCount = isLiked ? likeCount - 1 : likeCount + 1;
        setLikeCount(newCount);
        setIsLiked(!isLiked);
        toast.success(response.data.message);

        const updatedProfilePosts = selectedProfile.posts.map(p => {
          if (p._id === postId) {
            const updatedLikes = isLiked
              ? p.likes.filter(id => id !== user._id)
              : [...p.likes, user._id];
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
        dispatch(setProfile({ ...selectedProfile, posts: updatedProfilePosts }));
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while liking the post.");
    }
  }

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:3000/userPost/BookMark', { postId }, { withCredentials: true });
      if (response.data.success) {
        let newUser;
        if (isSaved) {
          toast.success("Post removed from bookmarks");
          newUser = { ...user, bookmarks: user.bookmarks.filter(id => id !== postId) };
        } else {
          toast.success("Post saved");
          newUser = { ...user, bookmarks: [...user.bookmarks, postId] };
        }
        dispatch(setUser(newUser));
        setIsSaved(!isSaved);
      } else {
        toast.error(response?.data.message || "Error saving post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Error saving post");
    }
  }

  const sendComment = async () => {
    try {
      const response = await axios.post('http://localhost:3000/userPost/comment', { postId, text }, { withCredentials: true });
      if (response.data.success) {
        toast.success("Comment added successfully");
        setText("");

        const updatedProfilePosts = selectedProfile.posts.map(p => {
          if (p._id === postId) {
            return { ...p, noOfComments: (p.noOfComments || 0) + 1 };
          }
          return p;
        });
        dispatch(setProfile({ ...selectedProfile, posts: updatedProfilePosts }));

        setTemp(!temp);
      } else {
        toast.error(response?.data.message || "Error sending comment");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error sending comment");
    }
  }

  useEffect(() => {
    if (showPost && postId) {
      const getComments = async () => {
        try {
          const response = await axios.post('http://localhost:3000/userPost/Comments', { postId }, {
            withCredentials: true,
          });
          if (response.data.success) {
            setComments(response.data.comments);
          }
        } catch (err) {
          console.error("Error fetching comments:", err);
        }
      }
      getComments();
    }
  }, [showPost, postId, temp]);
  console.log(post);
  return (
    <Dialog open={showPost}>
      <DialogContent onInteractOutside={() => setShow(false)} className='w-[70%] h-[95%] p-0 border-none rounded-none outline-none overflow-hidden'>
        <div className='flex w-full h-full' name='comment-container'>
          <div className='w-1/2 h-full border-r border-[#FFFFFF50] flex-shrink-0 bg-black'>
            <img src={post.image} alt='post_img' className='w-full h-full object-contain' />
          </div>

          <div name="right-side" className='flex flex-col w-1/2 h-full bg-[#FFFFFF15] flex-shrink-0'>
            <div className='flex w-full items-center pr-3 pl-3 pt-4 pb-4 justify-between border-b dark:border-[#FFFFFF50] flex-shrink-0'>
              <div className='flex items-center gap-2 overflow-hidden'>
                <Avatar>
                  <AvatarImage src={post.author.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='font-bold text-md truncate'>{post.author.username}</div>
                <div className='truncate'>{post.caption}</div>
              </div>
              {/* The post options dialog has been removed from here */}
            </div>

            {/* Scrollable comments list with corrected style tag */}
            <div className='flex-grow overflow-y-auto p-3 w-full hide-scrollbar'>
              <style>
                {`
                  .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                  .hide-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                  }
                `}
              </style>
              {comments.map((comment) => (
                <div key={comment._id} className='flex gap-2 mb-5'>
                  <Avatar><AvatarImage src={comment.author.profilePicture} /><AvatarFallback>CN</AvatarFallback></Avatar>
                  <div className='flex flex-col text-sm'><span className='font-bold'>{comment.author.username}</span><span>{comment.text}</span></div>
                </div>
              ))}
            </div>

            <div className='w-full px-4 pt-2 pb-4 border-t dark:border-[#FFFFFF50] flex-shrink-0'>
              <div className='flex justify-between items-center mb-3'>
                <div className='flex gap-4 items-center'>
                  <button onClick={likeDislike} aria-label="Like post" className="focus:outline-none">
                    <Heart className='cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110' fill={isLiked ? '#FF3040' : 'none'} stroke={isLiked ? '#FF3040' : 'currentColor'} />
                  </button>
                  <button aria-label="Share post"><Send className='cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110' /></button>
                </div>
                <div>
                  <button onClick={handleSave} aria-label="Save post">
                    <Bookmark className='cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110' fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              <div className='text-sm font-semibold mb-2'>{likeCount} likes</div>
              <div className='flex gap-3 items-center'>
                <textarea placeholder='Add a comment...' value={text} onChange={onInputChange} className='w-full bg-transparent resize-none overflow-y-auto text-sm focus:outline-none' rows="1" />
                <button className={`font-semibold ${text.trim() ? 'text-blue-500 cursor-pointer' : 'text-gray-500 opacity-50 cursor-not-allowed'}`} disabled={!text.trim()} onClick={sendComment}>Post</button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FullPost;