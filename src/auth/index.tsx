import React from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Route, Routes } from "react-router";
import { BrowserRouter,Navigate } from "react-router-dom";

import { ProjectModal } from "component/modal"

import {AuthHeader} from 'component/auth-header';
import {Task} from 'auth/Homepage'
import {Board} from 'auth/board'
import {Epic} from 'auth/epic'
import {TaskBoard} from 'auth/TaskBoard'

export const Main =() =>{
    
    return (
        <BrowserRouter>
            <AuthHeader />
                <Routes>
                    <Route index element={<Task />} ></Route>
                    <Route path='task/:id' element={<Board />}>
                        <Route path='Epic' element={<Epic />} />
                        <Route path='Event' element={<TaskBoard />} /> 
                        <Route index element={<Epic />} />
                    </Route>
                </Routes>
            <ProjectModal projectModalOpen={false} />
            <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
        </BrowserRouter>
    )
}