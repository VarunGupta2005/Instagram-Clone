// src/components/ui/MainLayout.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { SideBar } from './SideBar';

const MainLayout = () => {
  // 1. Get user state and location (from ProtectedRoute)
  const { user } = useSelector((store) => store.auth);
  const location = useLocation();

  // 2. Add the protection logic (from ProtectedRoute)
  if (!user) {
    // Redirect to signin if not authenticated
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 3. If authenticated, render the shared layout (from HeadCom)
  return (
    <div className="flex h-screen">
      {/* Sidebar is always present for routes inside this layout */}
      <SideBar />

      {/* The Outlet will render the specific child route (e.g., Home, Profile) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar h-screen w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;