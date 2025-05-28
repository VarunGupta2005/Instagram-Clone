import React from 'react'
import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';
const HeadCom = () => {
  return (
    <>
    <SideBar />
    <Outlet /></>
    
  )
}
export  {HeadCom}
