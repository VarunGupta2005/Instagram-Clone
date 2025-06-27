import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx"
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Bookmark, MessageCircle, Send, MoreHorizontal } from 'lucide-react'
import Comment from './Comment.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogTrigger } from "./dialog.jsx";
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts } from '../../redux/postSlice.js';
import { setUser } from '../../redux/authSlice.js';
import { Link } from 'react-router-dom'; // Step 1: Import Link for navigation

const PostFrame = ({ post }) => {
  const image = post?.image;
  const postId = post?._id;
  const [text, setText] = useState("");
  const { user } = useSelector((store) => store.auth);
  const [showComment, setShowComment] = useState(false);
  const [openPostOptions, setOpenPostOptions] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (user && post) {
      setLiked(post.likes.includes(user._id));
      setBookmarked(user.bookmarks.includes(postId));
      setLikeCount(post.likes.length);
    }
  }, [user, post]);

  const onInputChange = (e) => {
    const input = e.target.value;
    setText(input);
  }
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  const likeDislike = async () => {
    try {
      const response = await axios.post('https://chat-app-m37n.onrender.com/userPost/React', { postId }, { withCredentials: true });
      if (response.data.success) {
        const newCount = liked ? likeCount - 1 : likeCount + 1;
        setLikeCount(newCount);
        setLiked(!liked);
        toast.success(response.data.message)
        const updatedPosts = posts.map(p => {
          if (p._id === postId) {
            return { ...p, likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id] }
          } else {
            return p;
          }
        });
        dispatch(setPosts(updatedPosts));
      }
    } catch (err) {
      console.log(err);
    }
  }

  const sendComment = async () => {
    try {
      const response = await axios.post('https://chat-app-m37n.onrender.com/userPost/comment', { postId, text }, { withCredentials: true });
      if (response.data.success) {
        toast.success("Comment added successfully");
        setText("");
        const updatedPosts = posts.map(p => {
          if (p._id === postId) {
            return { ...p, numComments: (p.numComments || 0) + 1 };
          }
          else {
            return p;
          }
        })
        dispatch(setPosts(updatedPosts));
      }
      else {
        toast.error(response?.data.message || "Error sending comment");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error sending comment");
    }
  }

  const deletePost = async () => {
    try {
      console.log(postId);
      const response = await axios.post('https://chat-app-m37n.onrender.com/userPost/DeletePost', { postId }, { withCredentials: true });
      if (response.data.success) {
        const newPosts = posts.filter((post) => post._id !== postId);
        dispatch(setPosts(newPosts));
        setOpenPostOptions(false);
        toast.success("Post deleted successfully");
      }
      else {
        toast.error(response?.data.message || "Error deleting post");
      }
    } catch (err) {
      toast.error("Error deleting post");
      console.log(err);
    }
  }

  const handleSave = async () => {
    try {
      const response = await axios.post('https://chat-app-m37n.onrender.com/userPost/BookMark', { postId }, { withCredentials: true });
      if (response.data.success) {
        let newUser;
        if (bookmarked) {
          toast.success("Post removed from bookmarks");
          newUser = { ...user, bookmarks: user.bookmarks.filter(id => id !== postId) };
        } else {
          toast.success("Post saved");
          newUser = { ...user, bookmarks: [...user.bookmarks, postId] };
        }
        dispatch(setUser(newUser));
        setBookmarked(!bookmarked);
      } else {
        toast.error(response?.data.message || "Error saving post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Error saving post");
    }
  }

  return (
    <div className='w-full max-w-lg rounded-md p-4 flex flex-col gap-1 mt-2'>
      <div className='flex justify-between items-center'>
        {/* Step 2: Wrap author info in a Link component */}
        <Link to={`/profile/${post.author.username}`} className='flex gap-2 items-center'>
          <Avatar>
            <AvatarImage src={post.author.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className='text-sm font-bold'>{post.author.username}</p>
        </Link>
        <Dialog open={openPostOptions} >
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer' onClick={() => { setOpenPostOptions(true) }} />
          </DialogTrigger>
          <DialogContent className="w-[25%] p-0 outline-none border-none flex flex-col items-center justify-center dark:bg-[#1e1e1e] gap-0" onInteractOutside={() => { setOpenPostOptions(false) }}>
            {user.following.includes(post.author._id) && (<div className='w-full border-b border-[#FFFFFF50] pt-3 pb-3 text-center rounded-t-md cursor-pointer text-[#ED4956] font-bold'>Unfollow</div>)}
            {
              user.username === post.author.username && (<div className='w-full border-b border-[#FFFFFF50] pt-3 pb-3 text-center cursor-pointer' onClick={deletePost}>Delete Post</div>)
            }
            <div className='w-full pt-3 pb-3 text-center rounded-b-md cursor-pointer' onClick={() => setOpenPostOptions(false)}>Cancel</div>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <img src={image} className='rounded-sm aspect-square object-cover w-full mt-2' alt=''></img>
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-3.5 mt-2 ml-1'>
          {
            (liked ? <FaHeart className='w-6 h-6 cursor-pointer text-red-500' onClick={likeDislike} /> : <FaRegHeart className='w-6 h-6 cursor-pointer hover:text-gray-600' onClick={likeDislike} />)
          }
          <MessageCircle onClick={() => { setShowComment(true); }} className='w-6 h-6 cursor-pointer hover:text-gray-600' />
          <Send className='w-6 h-6 cursor-pointer hover:text-gray-600' />
        </div>
        <div className='w-6 h-6 cursor-pointer hover:text-gray-600' onClick={handleSave}>
          {bookmarked ? (<Bookmark fill="currentColor" />) : (<Bookmark />)}
        </div>
      </div>
      <div className='flex flex-col gap-1 text-sm'>
        <span>{likeCount} likes</span>
        <p className='flex gap-1 items-center'>
          {/* Step 3: Wrap the username in the caption with a Link */}
          <Link to={`/profile/${post.author.username}`}>
            <span className='font-bold hover:underline'>{post.author.username}</span>
          </Link>
          <span>{post.caption}</span>
        </p>
        {post.numComments > 0 && (
          <span className='cursor-pointer text-gray-500' onClick={() => { setShowComment(true); }}>
            View all {post.numComments} comments...
          </span>
        )}
      </div>
      <Comment setDialog={setShowComment} showComment={showComment} post={post} />
      <div className='flex custom-scrollbar justify-between gap-2 border-t border-gray-700 pt-2 mt-1'>
        <textarea type="text"
          placeholder='Add a comment...'
          value={text}
          onChange={onInputChange}
          className='w-full bg-transparent h-7 resize-none overflow-y-auto text-sm focus:outline-none'
        />
        {
          text && <button className='text-blue-500 font-semibold cursor-pointer' onClick={sendComment}>Post</button>
        }
      </div>
    </div >
  )
}

export default PostFrame;