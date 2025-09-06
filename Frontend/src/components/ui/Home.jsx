// src/components/Home.jsx

import React from 'react';
import Posts from './Posts.jsx';
// 1. Import the new custom hook
import useGetAllPosts from '../../hooks/useGetAllPosts.jsx';
import SuggestedUsers from './SuggestedUsers.jsx';
import useGetSuggestions from '../../hooks/useGetSuggestions.jsx';

const Home = () => {
  // 2. Call the custom hook at the top level of the component.
  // Now it returns functions for infinite scrolling
  const { fetchMorePosts, hasMorePosts, isLoadingPosts } = useGetAllPosts();
  useGetSuggestions();

  return (
    <div className='flex '>
      <Posts
        fetchMorePosts={fetchMorePosts}
        hasMorePosts={hasMorePosts}
        isLoadingPosts={isLoadingPosts}
      />
      <SuggestedUsers />
    </div>
  );
};

export { Home };

