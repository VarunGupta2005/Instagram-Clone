// src/hooks/useGetAllPosts.jsx

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts, appendPosts, setLoadingPosts } from "../redux/postSlice.js";

const useGetAllPosts = () => {
  const dispatch = useDispatch();
  const { currentPage, hasMorePosts, isLoadingPosts } = useSelector(store => store.post);

  // Function to fetch initial posts (page 1)
  const fetchInitialPosts = useCallback(async () => {
    try {
      dispatch(setLoadingPosts(true));
      const response = await axios.get("https://chat-app-m37n.onrender.com/userPost/AllPosts?page=1", {
        withCredentials: true
      });

      if (response.data.success) {
        dispatch(setPosts(response.data.posts));
        console.log('Initial posts fetched:', response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching initial posts:", error);
    } finally {
      dispatch(setLoadingPosts(false));
    }
  }, [dispatch]);

  // Function to fetch more posts (next page)
  const fetchMorePosts = useCallback(async () => {
    if (isLoadingPosts || !hasMorePosts) return;

    try {
      dispatch(setLoadingPosts(true));
      const nextPage = currentPage + 1;
      const response = await axios.get(`https://chat-app-m37n.onrender.com/userPost/AllPosts?page=${nextPage}`, {
        withCredentials: true
      });

      if (response.data.success) {
        dispatch(appendPosts(response.data.posts));
        console.log(`Page ${nextPage} posts fetched:`, response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      dispatch(setLoadingPosts(false));
    }
  }, [dispatch, currentPage, hasMorePosts, isLoadingPosts]);

  // Fetch initial posts on component mount
  useEffect(() => {
    fetchInitialPosts();
  }, [fetchInitialPosts]);

  return { fetchMorePosts, hasMorePosts, isLoadingPosts };
};

export default useGetAllPosts;