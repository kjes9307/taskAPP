import React from 'react'
import {Container} from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router'

export const Board = ()=>{
  return (
    <>
    <Container fluid='md'>
    <Link to='Epic'>任務組</Link>
    <Link to="Event" className='ms-3'>看板</Link>
    </Container>
    <Outlet />
    </>
  )
}