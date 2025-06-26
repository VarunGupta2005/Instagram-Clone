// src/components/Home.jsx

import React, { use } from 'react';
import Posts from './Posts.jsx';
// 1. Import the new custom hook
import useGetAllPosts from '../../hooks/useGetAllPosts.jsx';
import SuggestedUsers from './SuggestedUsers.jsx';
import useGetSuggestions from '../../hooks/useGetSuggestions.jsx';
const Home = () => {
  // 2. Call the custom hook at the top level of the component.
  // It doesn't return anything; it just starts the data fetching process.


  // 3. Render the Posts component immediately.
  // The Posts component will get its data from the Redux store.
  // It will render initially with the default state and then automatically
  // re-render as soon as the hook successfully fetches and dispatches the posts.
  useGetAllPosts();
  useGetSuggestions();
  return (
    <div className='flex '>
      <Posts />
      <SuggestedUsers />
    </div>

  );
};

export { Home };