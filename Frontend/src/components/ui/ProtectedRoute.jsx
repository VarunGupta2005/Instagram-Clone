// src/components/auth/ProtectedRoute.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check for user data in the Redux store
  // Make sure the path 'state.user.userInfo' matches your Redux store structure
  const { user } = useSelector((store) => store.auth);
  const location = useLocation();
  // console.log(user);
  if (!user) {
    // If no user is found in Redux, redirect them to the login page.
    // We also pass the current location in the state. This is optional
    // but allows you to redirect the user back to the page they were
    // trying to access after they log in.
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If a user is found, render the child components (the protected page)
  return children;
};

export default ProtectedRoute;