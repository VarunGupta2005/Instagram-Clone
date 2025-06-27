import React, { use } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.jsx";
import { Button } from "./button.jsx";
import { useRef, useState } from 'react';
import { readFileAsDataURL } from '../../lib/utils.js'; // Assuming you have a utility function to read file as Data URL
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../redux/postSlice.js';
import { setProfile } from '../../redux/authSlice.js';

// import { read, readFile } from 'fs';
const CreatePost = ({ showCreate, setShowCreate, user }) => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const imageRef = useRef();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedProfile } = useSelector((store) => store.auth);
  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) {
      formData.append("image", image);
    }
    try {
      e.preventDefault();
      setLoading(true);
      const res = await axios.post('https://chat-app-m37n.onrender.com/userPost/Post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
        ,
        withCredentials: true
      })
      if (res.data.success) {
        setLoading(false);
        dispatch(setPosts([res.data.post, ...posts]));
        setShowCreate(false);
        toast.success(res.data.message);
        if (selectedProfile && selectedProfile.username === user.username) {
          dispatch(setProfile({
            ...selectedProfile,
            posts: [res.data.post, ...selectedProfile.posts]
          }));
        }

      }
      else {
        setLoading(false);
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  const ImageHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }
  return (
    <Dialog open={showCreate}>
      <DialogContent onInteractOutside={() => setShowCreate(false)} className="w-[50%] outline-none border-none flex flex-col gap-7 p-6">
        <div className='font-semibold text-center'>
          Create Post
        </div>
        <div className='flex gap-4 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture}>
            </AvatarImage>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-bold'>{user.username}</h1>

          </div>
        </div>
        <input ref={imageRef} type='file' className='hidden' onChange={ImageHandler}></input>
        <textarea value={caption} onChange={(e) => { setCaption(e.target.value) }} placeholder='Write a caption...' className='focus:outline-none resize-none overflow-y-auto w-full'>

        </textarea>
        {
          imagePreview && (
            <div className='w-full max-h-120 flex justify-center items-center'>
              <img src={imagePreview} className="object-fit max-h-120"></img>
            </div>
          )
        }
        <Button onClick={() => {
          imageRef.current.click();
        }}>
          Select image from computer
        </Button>
        {
          imagePreview && (
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please Wait
              </Button>
            ) : (
              <Button type="submit" onClick={createPostHandler} >
                Post
              </Button>
            )
          )
        }
      </DialogContent>
    </Dialog >
  )
}

export { CreatePost }
