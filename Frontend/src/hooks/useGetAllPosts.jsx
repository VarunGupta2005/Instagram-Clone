// src/hooks/useGetAllPosts.jsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setPosts } from "../redux/postSlice.js";

// 1. RENAME the function to start with "use". This makes it a valid custom hook.
const useGetAllPosts = () => {
  const dispatch = useDispatch();

  // 2. The useEffect hook contains the logic that runs after the component mounts.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://chat-app-m37n.onrender.com/userPost/AllPosts", { withCredentials: true });

        // Assuming your backend API on success directly returns the array of posts.
        if (response.data.success) {
          dispatch(setPosts(response.data.posts));
          console.log(response.data.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }); // 3. It's best practice to include `dispatch` in the dependency array.
};

export default useGetAllPosts;