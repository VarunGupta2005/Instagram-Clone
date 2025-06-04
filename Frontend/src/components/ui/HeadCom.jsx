import React from 'react'
import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';
const HeadCom = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar h-screen w-full">
        <Outlet />
      </div>
    </div>
  )
}
export { HeadCom }
