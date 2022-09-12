import React from 'react'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router'
export const Board = ()=>{
  return (
    <>
    <h1>board</h1>
    <Link to='Epic'>任務組</Link>
    <Link to="Event" className='ms-3'>看板</Link>
    <Outlet />
    </>
  )
}