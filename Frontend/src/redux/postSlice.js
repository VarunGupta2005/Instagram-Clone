import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    currentPage: 1,
    hasMorePosts: true,
    isLoadingPosts: false,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.currentPage = 1;
      state.hasMorePosts = action.payload.length === 5; // If we got 5 posts, there might be more
    },
    appendPosts: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
      state.currentPage += 1;
      state.hasMorePosts = action.payload.length === 5; // If we got less than 5, no more posts
    },
    setLoadingPosts: (state, action) => {
      state.isLoadingPosts = action.payload;
    },
    resetPosts: (state) => {
      state.posts = [];
      state.currentPage = 1;
      state.hasMorePosts = true;
      state.isLoadingPosts = false;
    }
  }
})
export const { setPosts, appendPosts, setLoadingPosts, resetPosts } = postSlice.actions;
export default postSlice.reducer;